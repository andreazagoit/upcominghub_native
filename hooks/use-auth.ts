/**
 * Hook per l'autenticazione usando Zustand
 * Questo è un semplice re-export dello store per convenienza
 */

import {useAuthStore} from "@/stores/auth-store";

export const useAuth = () => {
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    signIn,
    signOut,
    user,
    isAuthenticated,
    isLoading,
  };
};
