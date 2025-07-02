import React, { createContext, useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { CircularProgress } from '@mui/material';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribed = auth.onIdTokenChanged((user) => {
      console.log('[AuthProvider] user changed: ', user);
      if (user?.uid) {
        setUser(user);
        localStorage.setItem('accessToken', user.accessToken);
      } else {
        setUser(null);
        localStorage.removeItem('accessToken');
      }
      setIsLoading(false);
    });

    return () => unsubscribed();
  }, [auth]);

  // Expose signOut để component khác dùng
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('accessToken');
    // không reload
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut: handleSignOut }}>
      {isLoading ? <CircularProgress /> : children}
    </AuthContext.Provider>
  );
}
