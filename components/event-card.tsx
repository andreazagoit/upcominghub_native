import React from "react";
import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {router} from "expo-router";

interface Event {
  id: string;
  name: string;
  description?: string | null;
  cover?: string | null;
  yearStart?: number | null;
  monthStart?: number | null;
  dayStart?: number | null;
  timeStart?: string | null;
  item?: {
    slug: string;
    name: string;
  } | null;
  availability?: Array<{
    id: string;
    platform: string;
    link?: string | null;
  }> | null;
}

interface EventCardProps {
  event: Event;
  /**
   * Se true, mostra la cover image
   */
  showCover?: boolean;
  /**
   * Se true, l'evento è cliccabile e naviga all'item
   */
  isClickable?: boolean;
  /**
   * Callback custom onPress (sovrascrive la navigazione default)
   */
  onPress?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  showCover = true,
  isClickable = true,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (isClickable && event.item?.slug) {
      router.push(`/items/${event.item.slug}`);
    }
  };

  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
        },
      ]}
    >
      {showCover && event.cover && (
        <View style={styles.coverContainer}>
          <Image
            uri={event.cover}
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
          {event.name}
        </Text>

        {event.item && (
          <Text variant="secondary" style={styles.itemName}>
            🎯 {event.item.name}
          </Text>
        )}

        {event.dayStart && event.monthStart && event.yearStart && (
          <Text variant="muted" style={styles.date}>
            📅 {event.dayStart}/{event.monthStart}/{event.yearStart}
            {event.timeStart && ` • ${event.timeStart}`}
          </Text>
        )}

        {event.description && (
          <Text
            variant="secondary"
            style={styles.description}
            numberOfLines={2}
          >
            {event.description}
          </Text>
        )}

        {event.availability && event.availability.length > 0 && (
          <View style={styles.platformsContainer}>
            {event.availability.slice(0, 3).map((avail) => (
              <View
                key={avail.id}
                style={[
                  styles.platformBadge,
                  {backgroundColor: isDark ? "#374151" : "#f3f4f6"},
                ]}
              >
                <Text
                  style={[
                    styles.platformText,
                    {color: isDark ? "#d1d5db" : "#374151"},
                  ]}
                >
                  {avail.platform}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  if (!isClickable && !onPress) {
    return content;
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => [pressed && styles.pressed]}
    >
      {content}
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
    height: 180,
  },
  cover: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  itemName: {
    fontSize: 13,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  platformsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  platformText: {
    fontSize: 11,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.8,
  },
});
