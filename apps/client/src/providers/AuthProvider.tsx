/* eslint-disable react-refresh/only-export-components */
import React from "react";
import useSWR from "swr";

import { User } from "@/types";

export interface AuthContextType {
  isLoggedIn: boolean;
  logout: () => void;
  user?: User;
}

export const AuthContext = React.createContext<AuthContextType>({
  isLoggedIn: false,
  logout: () => {
    throw new Error("Not Implemented");
  },
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const { data: user } = useSWR<User>("/auth/@me", {
    errorRetryCount: 0,
    onError: (err) => {
      console.error(err);
    },
  });

  const isLoggedIn = Boolean(user);

  const logout = () => {
    localStorage.removeItem("token");
    location.reload();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
