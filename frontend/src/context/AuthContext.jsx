import React, { createContext, useState, useEffect } from 'react';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, loginRequest, graphConfig } from '../config/msalConfig';
import { checkAdmin } from '../services/authService';
import { getVoterByMail } from '../services/voterService';
import axios from 'axios';

export const AuthContext = createContext();

const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMsalInstance = async () => {
      try {
        await msalInstance.initialize();
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await getUserData(accounts[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeMsalInstance();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      await msalInstance.handleRedirectPromise();
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      setAccount(loginResponse.account);
      await getUserData(loginResponse.account);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await msalInstance.logoutPopup({
        postLogoutRedirectUri: '/',
      });
      setAccount(null);
      setUserData(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  const getUserData = async (account) => {
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      let userResponse = await axios.get(graphConfig.graphMeEndpoint, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });

      const scanAdmin = await checkAdmin(userResponse.data.userPrincipalName);
      setIsAdmin(scanAdmin ? true : false);

      let userData = await getVoterByMail(userResponse.data.userPrincipalName);
      userResponse.data.electionName = userData.election_name;
      userResponse.data.status = userData.status;

      const photoResponse = await axios.get(`${graphConfig.graphMeEndpoint}/photo/$value`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
        responseType: 'blob'
      });

      const photoUrl = URL.createObjectURL(photoResponse.data);

      setUserData({
        ...userResponse.data,
        photoUrl,
      });
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        console.error('Interaction required:', error);
        await login(); // Trigger interactive login
      } else {
        console.error(error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ account, userData, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
