import React, { createContext, useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, graphConfig } from '../config/msalConfig';
import axios from 'axios';

export const AuthContext = createContext();

const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      getUserData(accounts[0]);
    }
  }, []);

  const login = async () => {
    try {
      await msalInstance.handleRedirectPromise();
      const loginResponse = await msalInstance.loginPopup(loginRequest);
      setAccount(loginResponse.account);
      getUserData(loginResponse.account);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    msalInstance.logoutRedirect();
    setAccount(null);
    setUserData(null);
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
      setUserData(userResponse.data);
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
