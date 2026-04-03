import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: process.env.REACT_APP_COGNITO_AUTHORITY || "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_hvkWLwFOg",
  client_id: process.env.REACT_APP_COGNITO_CLIENT_ID || "1h7s11q2r96cc1jq5h36orfrk7",
  redirect_uri: process.env.REACT_APP_COGNITO_REDIRECT_URI || "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "phone openid email",
  onSigninCallback: (user) => {
    // Handle post-signin redirect
    console.log('User signed in:', user);
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
