import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/api';

const AuthContext = createContext();

// Decode JWT to get expiry
const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // convert to ms
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Check if token is already expired
      const expiry = getTokenExpiry(token);
      if (expiry && Date.now() >= expiry) {
        logout();
        setLoading(false);
        return;
      }

      getMe().then(data => {
        if (data._id) {
          setUser(data);
          // Set auto-logout timer
          if (expiry) {
            const timeout = expiry - Date.now();
            const timer = setTimeout(() => {
              logout();
              window.location.href = '/signin';
            }, timeout);
            return () => clearTimeout(timer);
          }
        } else {
          logout();
        }
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [logout]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);

    // Set auto-logout timer on login
    const expiry = getTokenExpiry(token);
    if (expiry) {
      const timeout = expiry - Date.now();
      setTimeout(() => {
        logout();
        window.location.href = '/signin';
      }, timeout);
    }
  };

  const updateUser = (userData) => setUser(prev => ({ ...prev, ...userData }));

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
