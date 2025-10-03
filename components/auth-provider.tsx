import {Text} from "@/components/ui/text";
import {useAuth} from "@/lib/auth";
import React from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const {isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text variant="secondary" style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  userText: {
    marginTop: 8,
    fontSize: 14,
  },
});
