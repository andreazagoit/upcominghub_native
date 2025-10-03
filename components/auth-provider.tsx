import React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  // AuthProvider non fa più nulla - lo stato è gestito da zustand nel layout
  return <>{children}</>;
};
