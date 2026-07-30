"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  parseJwt,
  setAuthCookie,
  clearAuthCookie,
  signIn,
  signUp,
  signOutRequest,
  fetchMyProfile,
  refreshAuthToken,
  UserProfile
} from "../lib/auth";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  authtoken: string | null;
  login: (email: string, password: string) => Promise<string>;
  register: (payload: any) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authtoken, setAuthtoken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load and hydrate session on mount
  useEffect(() => {
    async function hydrateAuth() {
      const storedToken = localStorage.getItem("munifix_authtoken");
      const storedRefresh = localStorage.getItem("munifix_refresh_token");

      if (storedToken) {
        setAuthtoken(storedToken);
        const decoded = parseJwt(storedToken);
        if (decoded) {
          // Initialize state with decoded token values before profile loads
          const initialUser = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: "", // temporary
          };
          setUser(initialUser);
          localStorage.setItem("user", JSON.stringify(initialUser));

          try {
            // Fetch the full profile (including name and department_id)
            const profile = await fetchMyProfile(storedToken);
            const fullUser = {
              id: decoded.id,
              email: decoded.email,
              role: decoded.role,
              name: profile.name,
              department_id: profile.department_id,
            };
            setUser(fullUser);
            localStorage.setItem("user", JSON.stringify(fullUser));
            setAuthCookie(storedToken); // Refresh cookie lifecycle
          } catch (error) {
            console.error("Hydration profile fetch failed, trying to refresh token:", error);
            if (storedRefresh) {
              try {
                const refreshed = await refreshAuthToken(storedRefresh);
                const newAccessToken = refreshed.authtoken;
                localStorage.setItem("munifix_authtoken", newAccessToken);
                setAuthtoken(newAccessToken);
                setAuthCookie(newAccessToken);

                const newDecoded = parseJwt(newAccessToken);
                if (newDecoded) {
                  const profile = await fetchMyProfile(newAccessToken);
                  const fullUser = {
                    id: newDecoded.id,
                    email: newDecoded.email,
                    role: newDecoded.role,
                    name: profile.name,
                    department_id: profile.department_id,
                  };
                  setUser(fullUser);
                  localStorage.setItem("user", JSON.stringify(fullUser));
                }
              } catch (refreshErr) {
                console.error("Token refresh failed:", refreshErr);
                // Clear state
                localStorage.removeItem("user");
                localStorage.removeItem("munifix_authtoken");
                localStorage.removeItem("munifix_refresh_token");
                clearAuthCookie();
                setUser(null);
                setAuthtoken(null);
              }
            } else {
              // Clear state
              localStorage.removeItem("user");
              localStorage.removeItem("munifix_authtoken");
              clearAuthCookie();
              setUser(null);
              setAuthtoken(null);
            }
          }
        }
      }
      setLoading(false);
    }

    hydrateAuth();
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    setLoading(true);
    try {
      const response = await signIn(email, password);
      const token = response.authtoken;
      const refresh = response.refreshToken;

      localStorage.setItem("munifix_authtoken", token);
      localStorage.setItem("munifix_refresh_token", refresh);
      setAuthCookie(token);
      setAuthtoken(token);

      const decoded = parseJwt(token);
      if (!decoded) {
        throw new Error("Invalid JWT token received from server");
      }

      // Set user with decoded values immediately
      const initialUser = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: "",
      };
      setUser(initialUser);
      localStorage.setItem("user", JSON.stringify(initialUser));

      // Now fetch full profile to retrieve the user's name
      try {
        const profile = await fetchMyProfile(token);
        const fullUser = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: profile.name,
          department_id: profile.department_id,
        };
        setUser(fullUser);
        localStorage.setItem("user", JSON.stringify(fullUser));
      } catch (err) {
        console.error("Fetch profile failed after login:", err);
      }

      return decoded.role;
    } catch (error) {
      setUser(null);
      setAuthtoken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("munifix_authtoken");
      localStorage.removeItem("munifix_refresh_token");
      clearAuthCookie();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: any): Promise<any> => {
    return await signUp(payload);
  };

  const logout = async () => {
    const storedRefresh = localStorage.getItem("munifix_refresh_token");
    if (storedRefresh && authtoken) {
      try {
        await signOutRequest(storedRefresh, authtoken);
      } catch (e) {
        console.error("Sign out API request failed:", e);
      }
    }

    // Always clear local storage & cookies even if the API request failed
    localStorage.removeItem("user");
    localStorage.removeItem("munifix_authtoken");
    localStorage.removeItem("munifix_refresh_token");
    clearAuthCookie();
    setUser(null);
    setAuthtoken(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, authtoken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
