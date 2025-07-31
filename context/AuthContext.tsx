import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  university_id?:string;
};

type AuthContextType = {
  user: Student | null;
  setUser: (user: Student | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<Student | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        setUserState(JSON.parse(savedUser));
      }
    };
    loadUser();
  }, []);

  const setUser = async (user: Student | null) => {
    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem("user");
      Alert.alert("Login Required", "Please log in to continue.");
    }
    setUserState(user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
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
