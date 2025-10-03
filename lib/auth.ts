/**
 * Sistema di autenticazione per React Native
 * Gestisce login e rinnovo token automatico
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
  slug: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

class ReactNativeAuth {
  private baseURL = "https://www.upcominghub.com";
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.loadTokensFromStorage();
  }

  /**
   * Carica i token salvati in AsyncStorage
   */
  private async loadTokensFromStorage(): Promise<void> {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        // Verifica se i token sono ancora validi (controllo base)
        try {
          const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          // Se il token è scaduto, non caricarlo
          if (tokenPayload.exp && tokenPayload.exp < currentTime) {
            console.log("Access token expired, clearing tokens");
            await this.clearTokensFromStorage();
            return;
          }

          this.accessToken = accessToken;
          this.refreshToken = refreshToken;
        } catch (parseError) {
          console.log("Invalid token format, clearing tokens");
          await this.clearTokensFromStorage();
        }
      }
    } catch (error) {
      console.error("Error loading tokens:", error);
    }
  }

  /**
   * Salva i token in AsyncStorage
   */
  private async saveTokensToStorage(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.setItem("accessToken", tokens.accessToken);
      await AsyncStorage.setItem("refreshToken", tokens.refreshToken);

      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
    } catch (error) {
      console.error("Error saving tokens:", error);
    }
  }

  /**
   * Rimuove i token da AsyncStorage
   */
  private async clearTokensFromStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");

      this.accessToken = null;
      this.refreshToken = null;
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  }

  /**
   * Login con email e password
   */
  async login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/auth/credentials/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email, password}),
        }
      );

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        // Salva i token
        await this.saveTokensToStorage({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });

        return {
          success: true,
          user: result.data.user,
        };
      } else {
        return {
          success: false,
          message: result.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Network error",
      };
    }
  }

  /**
   * Registrazione con email e password
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/auth/credentials/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({email, password, name}),
        }
      );

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        // Salva i token
        await this.saveTokensToStorage({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });

        return {
          success: true,
          user: result.data.user,
        };
      } else {
        return {
          success: false,
          message: result.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Network error",
      };
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      // Chiama l'endpoint di logout se abbiamo i token
      if (this.accessToken && this.refreshToken) {
        await this.makeAuthenticatedRequest("/api/auth/credentials/logout", {
          method: "POST",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Rimuovi sempre i token locali
      await this.clearTokensFromStorage();
    }
  }

  /**
   * Rinnova i token usando il refresh token
   */
  private async refreshTokens(): Promise<boolean> {
    if (!this.refreshToken) {
      console.log("No refresh token available");
      return false;
    }

    try {
      console.log("Attempting to refresh tokens...");
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({refreshToken: this.refreshToken}),
      });

      console.log("Refresh response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("Refresh response:", result);

        if (result.success && result.data?.accessToken) {
          await this.saveTokensToStorage({
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          });

          console.log("✅ Tokens refreshed successfully");
          return true;
        } else {
          console.log("❌ Refresh failed: Invalid response format");
        }
      } else {
        const errorText = await response.text();
        console.log("❌ Refresh failed:", response.status, errorText);
      }
    } catch (error) {
      console.error("❌ Token refresh error:", error);
    }

    return false;
  }

  /**
   * Processa la coda delle richieste fallite dopo il refresh
   */
  private processQueue(error: any | null = null): void {
    this.failedQueue.forEach(({resolve, reject}) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });

    this.failedQueue = [];
  }

  /**
   * Effettua una richiesta autenticata con refresh automatico
   */
  async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    if (!this.accessToken || !this.refreshToken) {
      throw new Error("No tokens available");
    }

    // Aggiungi l'Authorization header
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${this.accessToken}`,
      "x-refresh-token": this.refreshToken,
    };

    try {
      let response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // Se la richiesta è andata a buon fine, controlla se ci sono nuovi token
      if (response.ok) {
        const newAccessToken = response.headers.get("x-new-access-token");
        const newRefreshToken = response.headers.get("x-new-refresh-token");

        if (newAccessToken && newRefreshToken) {
          // Aggiorna i token salvati
          await this.saveTokensToStorage({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });

          console.log("🔄 Tokens refreshed automatically");
        }
      }

      // Se la richiesta fallisce con 401, prova a fare il refresh
      if (response.status === 401 && !endpoint.includes("/refresh")) {
        if (this.isRefreshing) {
          // Se stiamo già facendo il refresh, metti la richiesta in coda
          return new Promise((resolve, reject) => {
            this.failedQueue.push({resolve, reject});
          });
        }

        this.isRefreshing = true;

        try {
          const refreshSuccess = await this.refreshTokens();

          if (refreshSuccess) {
            // Riprova la richiesta originale con i nuovi token
            const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${this.accessToken}`,
                "x-refresh-token": this.refreshToken,
              },
            });

            this.processQueue();
            return retryResponse;
          } else {
            // Refresh fallito, logout silenzioso
            console.log("🔄 Token refresh failed, logging out silently");
            await this.logout();
            this.processQueue(new Error("Token refresh failed"));
            throw new Error("Authentication expired. Please login again.");
          }
        } catch (refreshError) {
          await this.logout();
          this.processQueue(refreshError);
          throw refreshError;
        } finally {
          this.isRefreshing = false;
        }
      }

      return response;
    } catch (error) {
      console.error("Request error:", error);
      throw error;
    }
  }

  /**
   * Ottieni i dati dell'utente corrente
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Se non abbiamo token, non possiamo fare la richiesta
      if (!this.accessToken || !this.refreshToken) {
        console.log("No tokens available for getCurrentUser");
        return null;
      }

      const response = await this.makeAuthenticatedRequest(
        "/api/auth/credentials/me"
      );

      if (response.ok) {
        const result = await response.json();
        return result.data?.user || null;
      }

      console.log("getCurrentUser failed with status:", response.status);
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  /**
   * Verifica se l'utente è autenticato
   */
  isAuthenticated(): boolean {
    return !!(this.accessToken && this.refreshToken);
  }

  /**
   * Verifica se l'endpoint di refresh è disponibile
   */
  async checkRefreshEndpoint(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({refreshToken: "test"}),
      });

      // Se riceviamo una risposta (anche con errore), l'endpoint esiste
      return response.status !== 404;
    } catch (error) {
      console.log("Refresh endpoint not available:", error);
      return false;
    }
  }

  /**
   * Ottieni il token di accesso corrente
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }
}

// Esporta un'istanza singleton
export const auth = new ReactNativeAuth();

// Hook per l'utilizzo in componenti React Native
export const useAuth = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const initializeAuth = async () => {
      if (auth.isAuthenticated()) {
        try {
          const userData = await auth.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Error initializing auth:", error);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await auth.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);

      // Aggiorna lo zustand store tramite import dinamico
      try {
        const {useAuthStore} = await import("@/stores/auth-store");
        const tokens = {
          accessToken: await AsyncStorage.getItem("accessToken"),
          refreshToken: await AsyncStorage.getItem("refreshToken"),
        };
        if (tokens.accessToken && tokens.refreshToken) {
          useAuthStore
            .getState()
            .login(tokens.accessToken, tokens.refreshToken, result.user);
        }
      } catch (error) {
        console.error("Error updating auth store:", error);
      }
    }
    return result;
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await auth.register(email, password, name);
    if (result.success && result.user) {
      setUser(result.user);

      // Aggiorna lo zustand store tramite import dinamico
      try {
        const {useAuthStore} = await import("@/stores/auth-store");
        const tokens = {
          accessToken: await AsyncStorage.getItem("accessToken"),
          refreshToken: await AsyncStorage.getItem("refreshToken"),
        };
        if (tokens.accessToken && tokens.refreshToken) {
          useAuthStore
            .getState()
            .login(tokens.accessToken, tokens.refreshToken, result.user);
        }
      } catch (error) {
        console.error("Error updating auth store:", error);
      }
    }
    return result;
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);

    // Aggiorna lo zustand store tramite import dinamico
    try {
      const {useAuthStore} = await import("@/stores/auth-store");
      useAuthStore.getState().logout();
    } catch (error) {
      console.error("Error updating auth store:", error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: auth.isAuthenticated(),
    login,
    register,
    logout,
    getCurrentUser: auth.getCurrentUser.bind(auth),
  };
};

export type {AuthTokens, User};
