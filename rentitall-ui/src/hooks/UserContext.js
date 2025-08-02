import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const initialData = JSON.parse(localStorage.getItem('loginData')) || { isLoggedIn: false, email: '' };
  const [loginData, setLoginData] = useState(initialData);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const updateUserData = async () => {
    if (loginData.isLoggedIn) {
      const user_jwtToken = Cookies.get('user_jwtToken');
      if (user_jwtToken) {
        try {
          const response = await axios.get(process.env.REACT_APP_LOGIN_SERVICE + "/get-user-details-from-token", {
            headers: {
              'Authorization': `Bearer ${user_jwtToken}`
            }
          });
          // console.log('/get-user-details-from-token', response);
          setUser(response.data.userDetails[0]);
        } catch (error) {
          console.error('Error fetching user details:', error);
          logOutUser();
        }
      } else {
        // console.log('JWT Token is not present');
        logOutUser()
      }
    }
  }
  const refreshData = updateUserData;

  useEffect(() => {

    updateUserData();
  }, [loginData]);

  useEffect(() => {
    // Persist loginData and user to local storage whenever they change
    localStorage.setItem('loginData', JSON.stringify(loginData));
    localStorage.setItem('user', JSON.stringify(user));
  }, [loginData, user]);

  const logOutUser = useCallback(async () => {
    Cookies.remove('user_jwtToken');
    localStorage.removeItem('loginData');
    localStorage.removeItem('user');
    setLoginData({ isLoggedIn: false, email: '' })
    setUser(null)
  })

  return (
    <UserContext.Provider value={{ loginData, setLoginData, logOutUser, user ,refreshData}}>
      {children}
    </UserContext.Provider>
  );
};
