import {auth} from "@/lib/auth";
import {ApolloClient, HttpLink, InMemoryCache, from} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "https://www.upcominghub.com/api/graphql",
});

const authLink = setContext((_, {headers}) => {
  const token = auth.getAccessToken();

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
