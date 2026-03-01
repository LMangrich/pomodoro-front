"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { UserData } from '@/src/types/user.types';
import { authService } from '@/src/services/auth.service';

interface UserContextType {
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUserData: (user: UserData) => void;
  updateUserData: (updatedFields: Partial<UserData>) => void;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app startup, try to fetch current user from backend
    const loadUserData = async () => {
      try {
        const response = await authService.currentUser();
        setUserData(response.user);
      } catch (error) {
        // User is not authenticated or session expired
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const updateUserData = (updatedFields: Partial<UserData>) => {
    setUserData((prev: UserData | null) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  const clearUserData = () => {
    setUserData(null);
  };

  const isAuthenticated = userData !== null;

  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        isAuthenticated,
        isLoading,
        setUserData,
        updateUserData,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
