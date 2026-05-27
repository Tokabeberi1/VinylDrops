import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Standalone auth data
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = '123456';
const AUTH_STORAGE_KEY = 'groovehq_auth';

function isValidLogin(email, password) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings] = useState({ id: 'app_1', public_settings: {} });

  // Check stored auth on mount
  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // Simulate checking public app settings
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if we have stored auth
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        try {
          const auth = JSON.parse(storedAuth);
          setUser(auth);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('App state check failed:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'Failed to load app',
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      // Auth is already checked during appState
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!isValidLogin(email, password)) {
        throw new Error('Invalid email or password');
      }

      // Create user object
      const newUser = {
        id: 'user_admin_1',
        email,
        full_name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString(),
      };

      // Store in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      setAuthError({
        type: 'login_failed',
        message: error.message || 'Login failed',
      });
      setIsLoadingAuth(false);
      throw error;
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);

    if (shouldRedirect) {
      window.location.href = '/';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
      login,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
