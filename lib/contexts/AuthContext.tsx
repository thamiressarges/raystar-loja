
"use client";

import { createContext, useContext, ReactNode } from "react";


export type AuthContextType = {
  isLoggedIn: boolean;
};


const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
});


export function AuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AuthContextType; 
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
