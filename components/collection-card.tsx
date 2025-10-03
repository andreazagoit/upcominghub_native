import React from "react";
import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@/components/ui/text";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {router} from "expo-router";

interface Collection {
  slug: string;
  name: string;
  description?: string | null;
  isFeatured?: boolean | null;
}

interface CollectionCardProps {
  collection: Collection;
  /**
   * Larghezza della card (opzionale, default: auto)
   */
  width?: number | string;
  /**
   * Callback custom onPress (sovrascrive la navigazione default)
   */
  onPress?: () => void;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  width,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/collections/${collection.slug}`);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
          width: width || "100%",
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}
            numberOfLines={2}
          >
            {collection.name}
          </Text>
          {collection.isFeatured && (
            <View
              style={[
                styles.featuredBadge,
                {backgroundColor: isDark ? "#3b82f6" : "#2563eb"},
              ]}
            >
              <Text style={styles.featuredText}>⭐</Text>
            </View>
          )}
        </View>
        {collection.description && (
          <Text
            variant="secondary"
            style={styles.description}
            numberOfLines={3}
          >
            {collection.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 120,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    lineHeight: 22,
  },
  featuredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  featuredText: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.8,
  },
});
