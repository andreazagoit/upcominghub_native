import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {Stack} from "expo-router";
import {StatusBar} from "expo-status-bar";
import "react-native-reanimated";
import React from "react";

import {AuthProvider} from "@/components/auth-provider";
import client from "@/graphql/client";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {useAuthStore} from "@/stores/auth-store";
import {ApolloProvider} from "@apollo/client/react";

export const unstable_settings = {
  initialRouteName: "(main)/home/index",
};

function AppContent() {
  const colorScheme = useColorScheme();
  const {isAuthenticated, isLoading} = useAuthStore();

  // Initialize auth state on mount
  React.useEffect(() => {
    useAuthStore.getState().checkAuthState();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ApolloProvider client={client}>
        <Stack>
          <Stack.Protected guard={isLoading}>
            <Stack.Screen name="index" options={{headerShown: false}} />
          </Stack.Protected>
          <Stack.Protected guard={!isLoading && isAuthenticated}>
            <Stack.Screen name="(main)" options={{headerShown: false}} />
          </Stack.Protected>
          <Stack.Protected guard={!isLoading && !isAuthenticated}>
            <Stack.Screen name="(auth)" options={{headerShown: false}} />
          </Stack.Protected>
          <Stack.Screen
            name="modal"
            options={{presentation: "modal", title: "Modal"}}
          />
          <Stack.Screen
            name="notification-on-boarding"
            options={{
              title: "Notification On Boarding",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="articles"
            options={{
              title: "Articles",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="collections"
            options={{
              title: "Collections",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="items"
            options={{
              title: "Items",
              headerShown: false,
            }}
          />
        </Stack>
      </ApolloProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
