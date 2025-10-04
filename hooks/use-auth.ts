/**
 * Hook per l'autenticazione usando Zustand
 * Questo è un semplice re-export dello store per convenienza
 */

import {useAuthStore} from "@/stores/auth-store";

export const useAuth = () => {
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const loadUser = useAuthStore((state) => state.loadUser);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // TODO: Implementare register nel store
  const register = async (email: string, password: string, name: string) => {
    console.warn("Register not implemented yet");
    return {success: false, message: "Not implemented"};
  };

  return {
    signIn,
    signOut,
    loadUser,
    register, // Alias temporaneo
    logout: signOut, // Alias per compatibilità
    user,
    isAuthenticated,
    isLoading,
  };
};
