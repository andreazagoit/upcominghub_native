import React from "react";
import {View, ActivityIndicator} from "react-native";
import {Text} from "./text";

interface LoadingProps {
  /**
   * Messaggio personalizzato (opzionale)
   */
  message?: string;
  /**
   * Dimensione dello spinner
   */
  size?: "small" | "large";
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Caricamento...",
  size = "large",
}) => {
  return (
    <View className="flex-1 justify-center items-center p-5">
      <ActivityIndicator size={size} className="mb-4" />
      {message && (
        <Text variant="muted" className="text-center">
          {message}
        </Text>
      )}
    </View>
  );
};

