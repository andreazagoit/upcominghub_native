import React from "react";
import {View} from "react-native";
import {Text} from "./text";
import {Button} from "./button";
import {router} from "expo-router";

interface SectionProps {
  /**
   * Titolo della sezione
   */
  title: string;
  /**
   * Sottotitolo/descrizione (opzionale)
   */
  description?: string;
  /**
   * Link "Vedi tutti" (opzionale)
   */
  viewAllLink?: string;
  /**
   * Testo del link (default: "Vedi tutti →")
   */
  viewAllText?: string;
  /**
   * Contenuto della sezione
   */
  children: React.ReactNode;
  /**
   * Se true, non aggiunge padding orizzontale al contenuto
   */
  noPadding?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  viewAllLink,
  viewAllText = "Vedi tutti →",
  children,
  noPadding = false,
}) => {
  return (
    <View className="mb-8">
      {/* Header */}
      <View className="px-5 mb-4 flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-semibold mb-1">{title}</Text>
          {description && (
            <Text variant="secondary" className="text-sm">
              {description}
            </Text>
          )}
        </View>
        {viewAllLink && (
          <Button variant="ghost" size="sm" onPress={() => router.push(viewAllLink)}>
            {viewAllText}
          </Button>
        )}
      </View>

      {/* Content */}
      <View className={noPadding ? "" : "px-5"}>
        {children}
      </View>
    </View>
  );
};

