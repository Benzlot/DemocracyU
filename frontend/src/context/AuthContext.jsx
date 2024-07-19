import React, { createContext, useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, graphConfig } from '../config/msalConfig';
import { checkAdmin } from '../services/authService';
import axios from 'axios';

export const AuthContext = createContext();

const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

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
        setIsLoading(false); // Set loading to false after initialization
      }
    };
    initializeMsalInstance();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true); // Set loading to true during login
      await msalInstance.handleRedirectPromise();
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      setAccount(loginResponse.account);
      await getUserData(loginResponse.account);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false after login
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
      const userResponse = await axios.get(graphConfig.graphMeEndpoint, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });

      const scanAdmin = await checkAdmin(userResponse.data.userPrincipalName);
      setIsAdmin(scanAdmin ? true : false);

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
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ account, userData, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
