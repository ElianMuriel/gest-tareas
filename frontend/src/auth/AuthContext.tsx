import { createContext, useState, useContext, useEffect } from "react";
import API from "../api/axios";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchMe = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data);
    } catch {
      logout();
    }
  };

  const login = (token: string) => {
    localStorage.setItem("access_token", token);
    fetchMe();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
