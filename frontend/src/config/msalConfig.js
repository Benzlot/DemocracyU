export const msalConfig = {
    auth: {
      clientId: 'edaf0096-1c9b-45d9-82ed-f74550b4bd17', 
      authority: 'https://login.microsoftonline.com/f7445e93-7b8f-4bb9-9ac8-b30d33268565', 
      redirectUri: 'https://democracyu.onrender.com', // Replace with your redirect URI
    },
    cache: {
      cacheLocation: 'sessionStorage', // This configures where your cache will be stored
      storeAuthStateInCookie: true, // Set this to true if you are having issues on IE11 or Edge
    },
  };
  
  export const loginRequest = {
    scopes: ['User.Read'], // Define the scopes you need
  };
  
  export const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  };
  