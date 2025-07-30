import React, { createContext, useContext, useState, ReactNode } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  status?: string;
  added_by?: string;
  batch?: string;
  created_at?: any; 
  degree?: string;
  department?: string;
  institutional_id?: string;
  otpExpiry?: number;
  password?: string;
  year?: string;
};

type AuthContextType = {
  user: Student | null;
  setUser: (user: Student | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Student | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
