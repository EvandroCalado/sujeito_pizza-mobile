import { createContext, useState } from "react";

interface AuthContextData {
  user: UserProps;
  isAuthenticated: boolean;
}

interface UserProps {
  id: string;
  name: string;
  email: string;
  token: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    token: "",
  } as UserProps);
  const isAuthenticated = !!user.name;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
