import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { GoogleAuthService, UserInfo } from "../services/GoogleAuthService";
import { GoogleDriveService } from "../services/GoogleDriveService";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
const WAS_AUTHENTICATED_KEY = "google_was_authenticated";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
  signInError: string | null;
  clearSignInError: () => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  saveToGoogleDrive: () => Promise<string>;
  loadFromGoogleDrive: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [gsiReady, setGsiReady] = useState(false);

  const clearSignInError = useCallback(() => setSignInError(null), []);

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
    try {
      const { token: newToken, userInfo } = await GoogleAuthService.signIn();
      setToken(newToken);
      setUser(userInfo);
      localStorage.setItem(WAS_AUTHENTICATED_KEY, "1");
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown";
      if (message === "access_denied") {
        setSignInError("Google sign-in is currently in closed beta. Reach out to the owner to be added.");
      } else if (message !== "popup_closed_by_user") {
        setSignInError("Sign-in failed. Please try again.");
      }
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

  const saveToGoogleDrive = useCallback(async (): Promise<string> => {
    if (!token) return "Not signed in.";
    setIsLoading(true);
    try {
      await GoogleDriveService.saveAllGamesToDrive(token);
      return "Saved to Google Drive!";
    } catch (err) {
      if (err instanceof Error && err.message === "NO_GAMES") {
        return "No saved games to upload.";
      }
      return "Save failed. Please try again.";
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const loadFromGoogleDrive = useCallback(async (): Promise<string> => {
    if (!token) return "Not signed in.";
    setIsLoading(true);
    try {
      await GoogleDriveService.loadAllGamesFromDrive(token);
      return "Loaded from Google Drive!";
    } catch (err) {
      if (err instanceof Error && err.message === "NO_DRIVE_DATA") {
        return "No saved games found on Google Drive.";
      }
      return "Load failed. Please try again.";
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
        signInError,
        clearSignInError,
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
