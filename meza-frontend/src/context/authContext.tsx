import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, ApiError } from "../lib/api";
import type { AuthUser } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  register: (data: { fullName: string; email: string; password: string }) => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<AuthUser>("/auth/me/")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function register(data: { fullName: string; email: string; password: string }) {
    const created = await api.post<AuthUser>("/auth/register/", {
      full_name: data.fullName,
      email: data.email,
      password: data.password,
    });
    setUser(created);
  }

  async function login(data: { email: string; password: string }) {
    const loggedIn = await api.post<AuthUser>("/auth/login/", data);
    setUser(loggedIn);
  }

  async function loginWithGoogle(idToken: string) {
    const loggedIn = await api.post<AuthUser>("/auth/google/", { id_token: idToken });
    setUser(loggedIn);
  }

  async function logout() {
    await api.post("/auth/logout/");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}

export { ApiError };