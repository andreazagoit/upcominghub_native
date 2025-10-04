import React from "react";
import {View} from "react-native";
import {Text} from "./text";
import {Button} from "./button";

interface ErrorViewProps {
  /**
   * Messaggio di errore
   */
  message?: string;
  /**
   * Callback per il retry (opzionale)
   */
  onRetry?: () => void;
  /**
   * Testo del bottone retry
   */
  retryText?: string;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  message = "Si è verificato un errore",
  onRetry,
  retryText = "Riprova",
}) => {
  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-6xl mb-4">⚠️</Text>
      <Text className="text-lg font-semibold mb-2 text-center">
        Oops!
      </Text>
      <Text variant="muted" className="text-center mb-6">
        {message}
      </Text>
      {onRetry && (
        <Button onPress={onRetry}>
          {retryText}
        </Button>
      )}
    </View>
  );
};

