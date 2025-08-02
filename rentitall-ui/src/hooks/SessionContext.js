// SessionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validateSession = async () => {
            try {
                const response = await axios.get('/validate-session', { withCredentials: true });
                if (response.data.loggedIn) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error validating session:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        validateSession();
    }, []);

    return (
        <SessionContext.Provider value={{ user, loading }}>
            {!loading && children}
        </SessionContext.Provider>
    );
};
