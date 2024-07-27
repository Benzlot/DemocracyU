import React, { createContext, useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, graphConfig } from '../config/msalConfig';
import { checkAdmin } from '../services/authService';
import { getVoterByMail } from '../services/voterService';
import axios from 'axios';
import Swal from 'sweetalert2';

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
  
      // Check if the user is an admin
      const scanAdmin = await checkAdmin(userResponse.data.userPrincipalName);
      setIsAdmin(scanAdmin ? true : false);
  
      if (!scanAdmin) {
        try {
          let userData = await getVoterByMail(userResponse.data.userPrincipalName);
          userResponse.data.electionName = userData.election_name;
          userResponse.data.status = userData.status;
        } catch (error) {
          // Handle "voter not found" error
          if (error.response && error.response.data && error.response.data.error === 'voter not found') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'คุณไม่มีสิทธิ์เข้าถึงการเลือกตั้งนี้',
            });
  
            // Clear local storage and reload after a delay
            setTimeout(() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }, 2000); // 2 seconds delay
          } else {
            console.error('Error fetching voter data:', error);
          }
          userResponse.data.electionName = null;
          userResponse.data.status = null;
        }
      } else {
        // Admin-specific logic (if needed)
        userResponse.data.electionName = null;
        userResponse.data.status = null;
      }
  
      // Fetch profile photo
      let photoUrl = 'https://res.cloudinary.com/dt2v2za3j/image/upload/v1722055023/Logo_PIM_duwqaz.png'; // Default photo URL
  
      try {
        const photoResponse = await axios.get(`${graphConfig.graphMeEndpoint}/photo/$value`, {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
          responseType: 'blob',
        });
  
        // Check if the photo response is valid
        if (photoResponse.status === 200) {
          photoUrl = URL.createObjectURL(photoResponse.data);
        } else {
          console.warn('Profile photo not found. Using default photo.');
        }
      } catch (photoError) {
        console.warn('Error fetching profile photo:', photoError);
      }
  
      setUserData({
        ...userResponse.data,
        photoUrl,
      });
  
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  };
  

  return (
    <AuthContext.Provider value={{ account, userData, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
