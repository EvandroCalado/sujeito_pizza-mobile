import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { api } from "../utils/api";

interface AuthContextData {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (creadentials: SignInProps) => Promise<void>;
  loadingAuth: boolean;
  loading: boolean;
}

interface UserProps {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface SignInProps {
  email: string;
  password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    name: "",
    email: "",
    token: "",
  } as UserProps);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user.name;

  useEffect(() => {
    async function getUser() {
      const userInfo = await AsyncStorage.getItem("@sujeitopizza");
      const user: UserProps = JSON.parse(userInfo || "{}");

      if (Object.keys(user).length > 0) {
        api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

        setUser({ ...user });
      }

      setLoading(false);
    }

    getUser();
  }, []);

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true);

    try {
      const response = await api.post("/users/session", {
        email,
        password,
      });

      const { id, name, token } = response.data;

      await AsyncStorage.setItem(
        "@sujeitopizza",
        JSON.stringify({ id, name, email, token })
      );

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser({
        id,
        name,
        email,
        token,
      });

      setLoadingAuth(false);
    } catch (error) {
      console.log(error);
      setLoadingAuth(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, loadingAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
