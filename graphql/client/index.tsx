import {ApolloClient, HttpLink, InMemoryCache, from} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";
import {Observable} from "@apollo/client/utilities";
import {useAuthStore} from "@/stores/auth-store";

const httpLink = new HttpLink({
  uri: "https://www.upcominghub.com/api/graphql",
});

// Funzione per rinnovare il token
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = useAuthStore.getState().refreshToken;
    
    if (!refreshToken) {
      console.log('[Token Refresh] No refresh token available');
      return null;
    }

    console.log('[Token Refresh] Attempting to refresh token...');
    
    const response = await fetch('https://www.upcominghub.com/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({refreshToken}),
    });

    const data = await response.json();

    if (data.success && data.data?.accessToken) {
      const newAccessToken = data.data.accessToken;
      console.log('[Token Refresh] Success! New token obtained');
      
      // Salva il nuovo token nello store
      await useAuthStore.getState().setAccessToken(newAccessToken);
      
      // Ricarica i dati utente con il nuovo token
      await useAuthStore.getState().loadUser();
      
      return newAccessToken;
    }

    console.log('[Token Refresh] Failed:', data.message);
    return null;
  } catch (error) {
    console.error('[Token Refresh] Error:', error);
    return null;
  }
};

// Link per gestire errori di autenticazione
const errorLink = onError((errorResponse: any) => {
  const {graphQLErrors, networkError, operation, forward} = errorResponse;
  
  console.log('[Error Link] Error intercepted');
  console.log('[Error Link] GraphQL Errors:', graphQLErrors);
  console.log('[Error Link] Network Error:', networkError);
  
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.log('[Error Link] Checking error:', err.message);
      console.log('[Error Link] Error extensions:', err.extensions);
      
      // Controlla se l'errore è "Utente non autenticato"
      if (
        err.message === 'Utente non autenticato' ||
        err.message?.includes('autenticato') ||
        err.extensions?.code === 'UNAUTHENTICATED'
      ) {
        console.log('[Auth Error] Token expired, attempting refresh...');
        
        // Tenta il refresh del token
        return new Observable((observer) => {
          refreshAccessToken()
            .then((newToken) => {
              if (!newToken) {
                // Se il refresh fallisce, logout
                console.log('[Auth Error] Refresh failed, logging out...');
                useAuthStore.getState().signOut();
                observer.error(new Error('Token refresh failed'));
                return;
              }

              console.log('[Auth Error] Token refreshed, retrying operation...');
              
              // Aggiorna l'header Authorization con il nuovo token
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${newToken}`,
                },
              });

              // Riprova l'operazione
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              };

              forward(operation).subscribe(subscriber);
            })
            .catch((error) => {
              observer.error(error);
            });
        });
      }
    }
  }
});

const authLink = setContext((_, {headers}) => {
  // Ottieni il token dallo store zustand
  const token = useAuthStore.getState().accessToken;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
