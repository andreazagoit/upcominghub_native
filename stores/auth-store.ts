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
  setLoading: (loading: boolean) => void;

  // Internal actions
  _setTokens: (
    accessToken: string,
    refreshToken: string,
    user: User
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

        // Salva i token usando l'azione interna
        await get()._setTokens(
          result.data.accessToken,
          result.data.refreshToken,
          result.data.user
        );

        return {
          success: true,
          user: result.data.user,
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

      // Rimuovi tokens e user data
      await Promise.all([
        storage.removeItem("accessToken"),
        storage.removeItem("refreshToken"),
        storage.removeItem("user"),
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

  _setTokens: async (accessToken: string, refreshToken: string, user: User) => {
    try {
      console.log("💾 Saving authentication data to storage...");

      // Save to storage
      await Promise.all([
        storage.setItem("accessToken", accessToken),
        storage.setItem("refreshToken", refreshToken),
        storage.setItem("user", JSON.stringify(user)),
      ]);

      console.log("✅ Authentication data saved successfully");

      // Update state
      set({
        isAuthenticated: true,
        user,
        accessToken,
        refreshToken,
        isLoading: false,
      });

      console.log("🎉 User logged in and state updated:", {
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("💥 Error saving auth data:", error);
      set({isLoading: false});
    }
  },

  checkAuthState: async () => {
    try {
      console.log("🔍 Checking auth state...");
      set({isLoading: true});

      const [accessToken, refreshToken, userString] = await Promise.all([
        storage.getItem("accessToken"),
        storage.getItem("refreshToken"),
        storage.getItem("user"),
      ]);

      console.log("📦 Tokens from storage:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUser: !!userString,
      });

      if (accessToken && refreshToken && userString) {
        const user = JSON.parse(userString);

        console.log("✅ User found in storage:", {
          name: user.name,
          email: user.email,
        });

        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
          isLoading: false,
        });
      } else {
        console.log("❌ No valid auth data found");
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
}));
