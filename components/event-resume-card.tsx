import React from "react";
import {Pressable, View} from "react-native";
import {Text} from "@/components/ui/text";
import {Card} from "@/components/ui/card";
import {Image} from "@/components/ui/image";

interface Event {
  id: number;
  name: string;
  cover?: string | null;
  yearStart?: number | null;
  monthStart?: number | null;
  dayStart?: number | null;
  timeStart?: string | null;
  availability?: {
    id: number;
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
  const content = (
    <View className="flex-row p-3 gap-3">
      {/* Cover Image */}
      <View className="w-16 h-16 rounded-xl overflow-hidden">
        <Image uri={event.cover} style={{width: "100%", height: "100%"}} />
      </View>

      {/* Event Info */}
      <View className="flex-1 justify-center">
        {/* Date - Prima del nome */}
        {event.dayStart && event.monthStart && event.yearStart && (
          <Text variant="caption" className="mb-1.5 text-zinc-500 dark:text-zinc-500">
            {event.dayStart}/{event.monthStart}/{event.yearStart}
            {event.timeStart && ` • ${event.timeStart}`}
          </Text>
        )}

        <Text variant="heading" className="mb-1.5 leading-snug" numberOfLines={2}>
          {event.name}
        </Text>

        {/* Platforms */}
        {event.availability && event.availability.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5 mt-1">
            {event.availability.slice(0, 3).map((avail) => (
              <View
                key={avail.id}
                className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700"
              >
                <Text variant="caption" className="font-medium text-gray-700 dark:text-gray-300">
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
      <Pressable onPress={onPress} className="active:opacity-80">
        <Card className="mb-3">{content}</Card>
      </Pressable>
    );
  }

  return <Card className="mb-3">{content}</Card>;
};
