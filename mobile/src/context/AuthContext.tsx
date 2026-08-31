import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

import { BopSession, LoginPayload, loginToBop } from "@/api/bopApi";
import { clearStoredChat } from "@/storage/chatStorage";
import { clearStoredSession, loadStoredSession, saveStoredSession } from "@/storage/sessionStorage";

type AuthContextValue = {
  session: BopSession | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<BopSession | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadStoredSession()
      .then((storedSession) => {
        if (isMounted) setSession(storedSession);
      })
      .finally(() => {
        if (isMounted) setIsBootstrapping(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const nextSession = await loginToBop(payload);
      await saveStoredSession(nextSession);
      setSession(nextSession);
    } catch (currentError) {
      const message = currentError instanceof Error ? currentError.message : "No se pudo iniciar sesion.";
      setError(message);
      throw currentError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    void clearStoredSession();
    void clearStoredChat();
    setSession(null);
    setError(null);
  };

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      isBootstrapping,
      isLoading,
      error,
      login,
      logout,
      clearError: () => setError(null)
    }),
    [error, isBootstrapping, isLoading, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
