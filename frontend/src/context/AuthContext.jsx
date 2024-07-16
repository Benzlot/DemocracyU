import React, { createContext, useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, graphConfig } from '../config/msalConfig';
import axios from 'axios';

export const AuthContext = createContext();

const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children, navigate }) => {
  const [account, setAccount] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const initializeMsalInstance = async () => {
      await msalInstance.initialize();
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await getUserData(accounts[0], navigate);
      }
    };
    initializeMsalInstance();
  }, [navigate]);

  const login = async () => {
    try {
      await msalInstance.handleRedirectPromise();
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      setAccount(loginResponse.account);
      await getUserData(loginResponse.account, navigate);
    } catch (error) {
      console.error(error);
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

  const getUserData = async (account, navigate) => {
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

      const photoResponse = await axios.get(`${graphConfig.graphMeEndpoint}/photo/$value`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
        responseType: 'blob'
      });

      const photoUrl = URL.createObjectURL(photoResponse.data);

      setUserData({
        ...userResponse.data,
        photoUrl
      });

      if (userResponse.data.jobTitle === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ account, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
