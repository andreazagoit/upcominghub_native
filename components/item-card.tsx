import React from "react";
import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {router} from "expo-router";

interface Item {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  cover?: string | null;
  events?: Array<{
    id: string;
    name?: string | null;
    yearStart?: number | null;
    monthStart?: number | null;
    dayStart?: number | null;
  }> | null;
}

interface ItemCardProps {
  item: Item;
  /**
   * Larghezza della card (opzionale, default: auto)
   */
  width?: number | string;
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
      {item.cover && (
        <View style={styles.coverContainer}>
          <Image
            uri={item.cover}
            imageStyle={styles.cover}
            resizeMode="cover"
            showPlaceholder={false}
          />
        </View>
      )}
      <View style={styles.content}>
        <Text
          style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {item.description && (
          <Text
            variant="secondary"
            style={styles.description}
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}
        {item.events && item.events.length > 0 && (
          <View style={styles.eventsInfo}>
            <Text variant="muted" style={styles.eventsCount}>
              📅 {item.events.length} event
              {item.events.length !== 1 ? "i" : "o"}
            </Text>
            {item.events[0].yearStart && (
              <Text variant="muted" style={styles.nextEvent}>
                Prossimo: {item.events[0].dayStart}/{item.events[0].monthStart}/
                {item.events[0].yearStart}
              </Text>
            )}
          </View>
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
  },
  coverContainer: {
    width: "100%",
    height: 160,
  },
  cover: {
    width: "100%",
    height: 160,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  eventsInfo: {
    marginTop: 8,
    gap: 4,
  },
  eventsCount: {
    fontSize: 11,
  },
  nextEvent: {
    fontSize: 11,
  },
  pressed: {
    opacity: 0.8,
  },
});
