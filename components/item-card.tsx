import React from "react";
import {StyleSheet, View, type DimensionValue} from "react-native";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {Card} from "@/components/ui/card";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {router} from "expo-router";

interface Item {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  cover?: string | null;
  events?: {
    id: string;
    name?: string | null;
    yearStart?: number | null;
    monthStart?: number | null;
    dayStart?: number | null;
  }[] | null;
}

interface ItemCardProps {
  item: Item;
  /**
   * Larghezza della card (opzionale, default: auto)
   */
  width?: DimensionValue;
  /**
   * Callback custom onPress (sovrascrive la navigazione default)
   */
  onPress?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({item, width, onPress}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/items/${item.slug}`);
    }
  };

  return (
    <Card
      pressable={true}
      onPress={handlePress}
      style={[styles.card, width ? {width} : null]}
    >
      {/* Immagine in alto */}
      <View style={styles.imageContainer}>
        <Image uri={item.cover} imageStyle={styles.cover} resizeMode="cover" />
      </View>

      {/* Testi sotto */}
      <View style={styles.content}>
        <Text
          style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        {item.description && (
          <Text variant="muted" style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Info eventi compatta */}
        {item.events && item.events.length > 0 && item.events[0].yearStart && (
          <Text variant="muted" style={styles.eventInfo}>
            📅 {item.events[0].dayStart}/{item.events[0].monthStart}/
            {item.events[0].yearStart}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
  },
  cover: {
    width: "100%",
    aspectRatio: 1, // Immagine quadrata
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 16,
  },
  eventInfo: {
    fontSize: 10,
  },
});
