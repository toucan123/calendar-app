import React, { useEffect, useState, createContext, useContext } from 'react';
import { oauth2_v2 } from 'googleapis';
import { api } from '../api/api';
import * as authUtils from './authUtils';

interface AuthContextType {
  user: oauth2_v2.Schema$Userinfo | undefined;  // FIXME: make own type?
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [user, setUser] = useState<oauth2_v2.Schema$Userinfo | undefined>(undefined);
  
  useEffect(() => {
    const validateToken = async () => {
      try {
        const { valid, user } = await api.validateAccessToken();
        console.log(user);
        if (valid) {
          setIsAuthenticated(true);
          setUser(user);
        }
      } catch(error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    }
    validateToken();
  }, []);

  const login = async () => {
    authUtils.googleConsent();
  };

  const logout = async () => {
    await api.logout();
    setUser(undefined);
    setIsAuthenticated(false);
  };

  if (isLoadingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}