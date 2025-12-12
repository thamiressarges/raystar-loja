'use client';

import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode } from 'react';


interface UIContextType {
  isAuthMenuOpen: boolean;
  setIsAuthMenuOpen: Dispatch<SetStateAction<boolean>>;
  openAuthMenu: () => void; 
}


export const UIContext = createContext<UIContextType | undefined>(undefined);


export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);

  
  const openAuthMenu = () => setIsAuthMenuOpen(true);

  const value = {
    isAuthMenuOpen,
    setIsAuthMenuOpen,
    openAuthMenu,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};


export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};