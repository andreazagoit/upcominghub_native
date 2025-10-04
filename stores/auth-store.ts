import {storage} from "@/utils/storage";
import {create} from "zustand";
import type {User as GeneratedUser} from "@/graphql/generated/graphql";

const BASE_URL = "https://www.upcominghub.com";

// Usa il tipo User generato ma ometti collections ed events
type User = Omit<GeneratedUser, "collections" | "events" | "__typename">;

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  // Actions
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }>;
  signOut: () => Promise<void>;
  checkAuthState: () => Promise<void>;
  loadUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setAccessToken: (token: string) => Promise<void>;

  // Internal actions
  _setTokens: (
    accessToken: string,
    refreshToken: string
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,

  // Actions
  signIn: async (email: string, password: string) => {
    try {
      console.log("🔐 Attempting login...");

      const response = await fetch(`${BASE_URL}/api/auth/credentials/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        console.log("✅ Login successful");

        // Salva solo i token
        await get()._setTokens(
          result.data.accessToken,
          result.data.refreshToken
        );

        // Carica i dati utente dal backend
        await get().loadUser();

        return {
          success: true,
          user: get().user || result.data.user,
        };
      } else {
        console.log("❌ Login failed:", result.message);
        return {
          success: false,
          message: result.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("💥 Login error:", error);
      return {
        success: false,
        message: "Network error",
      };
    }
  },

  signOut: async () => {
    try {
      console.log("👋 Signing out...");

      // Chiama l'endpoint di logout se abbiamo i token
      const {accessToken, refreshToken} = get();
      if (accessToken && refreshToken) {
        try {
          await fetch(`${BASE_URL}/api/auth/credentials/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "x-refresh-token": refreshToken,
            },
          });
        } catch (error) {
          console.log("Logout API call failed (non-critical):", error);
        }
      }

      // Rimuovi solo i tokens
      await Promise.all([
        storage.removeItem("accessToken"),
        storage.removeItem("refreshToken"),
      ]);

      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });

      console.log("✅ Signed out successfully");
    } catch (error) {
      console.error("💥 Logout error:", error);
    }
  },

  _setTokens: async (accessToken: string, refreshToken: string) => {
    try {
      console.log("💾 Saving tokens to storage...");

      // Salva solo i tokens
      await Promise.all([
        storage.setItem("accessToken", accessToken),
        storage.setItem("refreshToken", refreshToken),
      ]);

      console.log("✅ Tokens saved successfully");

      // Update state
      set({
        accessToken,
        refreshToken,
        isLoading: false,
      });
    } catch (error) {
      console.error("💥 Error saving tokens:", error);
      set({isLoading: false});
    }
  },

  loadUser: async () => {
    try {
      let {accessToken, refreshToken} = get();
      
      if (!accessToken) {
        console.log("❌ No access token, cannot load user");
        set({isAuthenticated: false, user: null, isLoading: false});
        return;
      }

      console.log("📡 Loading user from backend...");

      let response = await fetch(`${BASE_URL}/api/auth/credentials/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      let result = await response.json();

      // Se il token è scaduto, prova a rinnovarlo
      if (!result.success && result.code === 'UNAUTHORIZED' && refreshToken) {
        console.log("🔄 Token scaduto, tentativo di refresh...");
        
        const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({refreshToken}),
        });

        const refreshResult = await refreshResponse.json();

        if (refreshResult.success && refreshResult.data?.accessToken) {
          console.log("✅ Token rinnovato con successo");
          const newAccessToken = refreshResult.data.accessToken;
          
          // Salva il nuovo token
          await storage.setItem("accessToken", newAccessToken);
          set({accessToken: newAccessToken});
          
          // Riprova a caricare l'user con il nuovo token
          response = await fetch(`${BASE_URL}/api/auth/credentials/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          result = await response.json();
        } else {
          console.log("❌ Refresh token fallito, logout necessario");
          await get().signOut();
          return;
        }
      }

      if (result.success && result.data?.user) {
        console.log("✅ User loaded:", result.data.user.name);
        
        set({
          isAuthenticated: true,
          user: result.data.user,
          isLoading: false,
        });
      } else {
        console.log("❌ Failed to load user:", result.message);
        set({isAuthenticated: false, user: null, isLoading: false});
      }
    } catch (error) {
      console.error("💥 Error loading user:", error);
      set({isAuthenticated: false, user: null, isLoading: false});
    }
  },

  checkAuthState: async () => {
    try {
      console.log("🔍 Checking auth state...");
      set({isLoading: true});

      const [accessToken, refreshToken] = await Promise.all([
        storage.getItem("accessToken"),
        storage.getItem("refreshToken"),
      ]);

      console.log("📦 Tokens from storage:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });

      if (accessToken && refreshToken) {
        console.log("✅ Tokens found, loading user...");

        set({
          accessToken,
          refreshToken,
        });

        // Carica i dati utente dal backend
        await get().loadUser();
      } else {
        console.log("❌ No valid tokens found");
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("💥 Auth check error:", error);
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({isLoading: loading});
  },

  setAccessToken: async (token: string) => {
    try {
      console.log("💾 Updating access token...");
      await storage.setItem("accessToken", token);
      set({accessToken: token});
      console.log("✅ Access token updated");
    } catch (error) {
      console.error("💥 Error updating access token:", error);
    }
  },
}));
