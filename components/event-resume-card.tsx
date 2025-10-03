import React from "react";
import {Pressable, StyleSheet, View} from "react-native";
import {Text} from "@/components/ui/text";
import {Card} from "@/components/ui/card";
import {Image} from "@/components/ui/image";
import {useColorScheme} from "@/hooks/use-color-scheme";

interface Event {
  id: string;
  name: string;
  cover?: string | null;
  yearStart?: number | null;
  monthStart?: number | null;
  dayStart?: number | null;
  timeStart?: string | null;
  availability?: {
    id: string;
    platform: string;
    link?: string | null;
  }[] | null;
}

interface EventResumeCardProps {
  event: Event;
  /**
   * Callback custom onPress
   */
  onPress?: () => void;
}

export const EventResumeCard: React.FC<EventResumeCardProps> = ({
  event,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const content = (
    <View style={styles.content}>
      {/* Cover Image */}
      <View style={styles.imageContainer}>
        <Image
          uri={event.cover}
          imageStyle={styles.coverImage}
          resizeMode="cover"
          placeholderContent="🖼️"
        />
      </View>

      {/* Event Info */}
      <View style={styles.eventInfo}>
        {/* Date - Prima del nome */}
        {event.dayStart && event.monthStart && event.yearStart && (
          <Text variant="muted" style={styles.date}>
            {event.dayStart}/{event.monthStart}/{event.yearStart}
            {event.timeStart && ` • ${event.timeStart}`}
          </Text>
        )}

        <Text
          style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}
          numberOfLines={2}
        >
          {event.name}
        </Text>

        {/* Platforms */}
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

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({pressed}) => [pressed && styles.pressed]}
      >
        <Card style={styles.card}>{content}</Card>
      </Pressable>
    );
  }

  return <Card style={styles.card}>{content}</Card>;
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
  },
  coverImage: {
    width: 64,
    height: 64,
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 22,
  },
  date: {
    fontSize: 12,
    marginBottom: 6,
  },
  platformsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  platformText: {
    fontSize: 10,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.8,
  },
});
