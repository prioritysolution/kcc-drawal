"use client";

import { createContext, useContext, useState, ReactNode, FC } from "react";

interface User {
  username: string;
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create UserContext
const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider component
export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
