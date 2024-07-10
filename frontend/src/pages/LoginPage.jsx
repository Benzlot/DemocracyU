import React, { useState, useEffect, useContext } from "react";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig, loginRequest } from "../config/msalConfig";
import DigitalClock from "../components/DigitalClock";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

const msalInstance = new PublicClientApplication(msalConfig);

if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const LoginButton = () => {
  const { account, userData, login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (account) {
      if (userData?.jobTitle === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [account, userData, navigate]);

  return (
    <div>
      <div className="navbar-login">
        <div className="DemocracyU">DemocracyU</div>
      </div>
      <DigitalClock />
      <div className="login-container">
        <button onClick={login} className="button-login">
          <img
            src="https://cdn-icons-png.freepik.com/512/732/732221.png"
            alt="Login Icon"
            className="login-icon"
          />
          Login with Microsoft
        </button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <LoginButton />
    </MsalProvider>
  );
};

export default LoginPage;
