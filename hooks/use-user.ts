import {useAuthStore} from "@/stores/auth-store";

/**
 * Hook per accedere facilmente ai dati dell'utente corrente
 * @returns {Object} Dati dell'utente e stato di autenticazione
 */
export const useUser = () => {
  const {user, isAuthenticated, accessToken, refreshToken} = useAuthStore();

  return {
    user,
    isAuthenticated,
    accessToken,
    refreshToken,
    // Utility getters
    isLoggedIn: isAuthenticated && !!user,
    userName: user?.name || null,
    userEmail: user?.email || null,
    userId: user?.id || null,
    userRole: user?.role || null,
  };
};
