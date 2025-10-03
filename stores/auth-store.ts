import {storage} from "@/utils/storage";
import {create} from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  slug: string;
  type: string;
  bio?: string;
  image?: string;
  emailVerified?: string;
}

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  // Actions
  login: (
    accessToken: string,
    refreshToken: string,
    user: User
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,

  // Actions
  login: async (accessToken: string, refreshToken: string, user: User) => {
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

  logout: async () => {
    try {
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
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  checkAuthState: async () => {
    try {
      set({isLoading: true});

      const [accessToken, refreshToken, userString] = await Promise.all([
        storage.getItem("accessToken"),
        storage.getItem("refreshToken"),
        storage.getItem("user"),
      ]);

      if (accessToken && refreshToken && userString) {
        const user = JSON.parse(userString);
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
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
