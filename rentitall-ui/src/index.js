import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {UserProvider} from "./hooks/UserContext";
import Kommunicate from "@kommunicate/kommunicate-chatbot-plugin";

const GOOGLE_AUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID
// const GOOGLE_OAUTH_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_SECRET
const KOMMUNICATE_APP_ID = process.env.REACT_APP_KOMMUNICATE_APP_ID;

if(!window.location.href.includes('messaging')) {
  Kommunicate.init(KOMMUNICATE_APP_ID, {
    automaticChatOpenOnNavigation: false,
    popupWidget: true
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={GOOGLE_AUTH_CLIENT_ID}>
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
