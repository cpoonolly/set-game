import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { GoogleAuthService, UserInfo } from "../services/GoogleAuthService";
import { GoogleDriveService } from "../services/GoogleDriveService";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const WAS_AUTHENTICATED_KEY = "google_was_authenticated";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  saveToGoogleDrive: () => Promise<void>;
  loadFromGoogleDrive: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gsiReady, setGsiReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        clearInterval(interval);
        GoogleAuthService.initialize(CLIENT_ID);
        setGsiReady(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const signIn = useCallback(async () => {
    if (!gsiReady) return;
    setIsLoading(true);
    setError(null);
    try {
      const { token: newToken, userInfo } = await GoogleAuthService.signIn();
      setToken(newToken);
      setUser(userInfo);
      localStorage.setItem(WAS_AUTHENTICATED_KEY, "1");
    } catch (err) {
      setError("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [gsiReady]);

  const signOut = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      await GoogleAuthService.signOut(token);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem(WAS_AUTHENTICATED_KEY);
      setIsLoading(false);
    }
  }, [token]);

  const saveToGoogleDrive = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await GoogleDriveService.saveAllGamesToDrive(token);
    } catch (err) {
      if (err instanceof Error && err.message === "NO_GAMES") {
        setError("No saved games to upload.");
      } else {
        setError("Save failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const loadFromGoogleDrive = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await GoogleDriveService.loadAllGamesFromDrive(token);
    } catch (err) {
      if (err instanceof Error && err.message === "NO_DRIVE_DATA") {
        setError("No saved games found on Google Drive.");
      } else {
        setError("Load failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        user,
        isLoading,
        error,
        signIn,
        signOut,
        saveToGoogleDrive,
        loadFromGoogleDrive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthContextProvider");
  return ctx;
};
