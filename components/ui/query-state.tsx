import React from "react";
import {Loading} from "./loading";
import {ErrorView} from "./error-view";

interface QueryStateProps {
  /**
   * Stato di caricamento
   */
  loading: boolean;
  /**
   * Errore (se presente)
   */
  error?: Error | {message: string} | null;
  /**
   * Dati (se presenti)
   */
  data?: any;
  /**
   * Messaggio di caricamento personalizzato
   */
  loadingMessage?: string;
  /**
   * Messaggio di errore personalizzato
   */
  errorMessage?: string;
  /**
   * Callback per retry
   */
  onRetry?: () => void;
  /**
   * Contenuto da renderizzare quando tutto è ok
   */
  children: React.ReactNode;
}

/**
 * Componente wrapper per gestire automaticamente stati di loading ed errore
 * Ideale per wrappare le query GraphQL
 * 
 * @example
 * <QueryState loading={loading} error={error} data={data}>
 *   <YourContent data={data} />
 * </QueryState>
 */
export const QueryState: React.FC<QueryStateProps> = ({
  loading,
  error,
  data,
  loadingMessage,
  errorMessage,
  onRetry,
  children,
}) => {
  if (loading) {
    return <Loading message={loadingMessage} />;
  }

  if (error) {
    return (
      <ErrorView
        message={errorMessage || error.message}
        onRetry={onRetry}
      />
    );
  }

  if (!data) {
    return <ErrorView message="Nessun dato disponibile" onRetry={onRetry} />;
  }

  return <>{children}</>;
};

