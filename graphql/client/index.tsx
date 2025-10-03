import {ApolloClient, HttpLink, InMemoryCache, from} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import {useAuthStore} from "@/stores/auth-store";

const httpLink = new HttpLink({
  uri: "https://www.upcominghub.com/api/graphql",
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
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
