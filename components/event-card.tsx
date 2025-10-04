import React from "react";
import {View} from "react-native";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {Card} from "@/components/ui/card";
import {router} from "expo-router";

interface Event {
  id: number;
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
  availability?: {
    id: number;
    platform: string;
    link?: string | null;
  }[] | null;
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
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (isClickable && event.item?.slug) {
      router.push(`/items/${event.item.slug}`);
    }
  };

  return (
    <Card
      pressable={isClickable || !!onPress}
      onPress={handlePress}
      className="overflow-hidden mb-4"
    >
      {showCover && event.cover && (
        <View className="w-full h-[180px]">
          <Image uri={event.cover} style={{width: "100%", height: 180}} />
        </View>
      )}
      <View className="p-4">
        <Text className="text-lg font-semibold mb-1.5" numberOfLines={2}>
          {event.name}
        </Text>

        {event.item && (
          <Text variant="secondary" className="text-xs mb-1">
            🎯 {event.item.name}
          </Text>
        )}

        {event.dayStart && event.monthStart && event.yearStart && (
          <Text variant="muted" className="text-xs mb-2">
            📅 {event.dayStart}/{event.monthStart}/{event.yearStart}
            {event.timeStart && ` • ${event.timeStart}`}
          </Text>
        )}

        {event.description && (
          <Text variant="secondary" className="text-sm leading-5 mb-2" numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {event.availability && event.availability.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5 mt-1">
            {event.availability.slice(0, 3).map((avail) => (
              <View
                key={avail.id}
                className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700"
              >
                <Text className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {avail.platform}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
};
