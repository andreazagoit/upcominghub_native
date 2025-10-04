import React from "react";
import {StyleSheet, View, type DimensionValue} from "react-native";
import {Text} from "@/components/ui/text";
import {Card} from "@/components/ui/card";
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
  width?: DimensionValue;
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
    <Card
      pressable={true}
      onPress={handlePress}
      style={[styles.card, width ? {width} : null]}
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
            numberOfLines={2}
          >
            {collection.description}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 120,
    minWidth: 200,
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
});
