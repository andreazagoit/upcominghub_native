import React from "react";
import {View} from "react-native";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {Card} from "@/components/ui/card";
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
   * Callback custom onPress (sovrascrive la navigazione default)
   */
  onPress?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({item, onPress}) => {
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
      className="overflow-hidden w-40"
    >
      {/* Immagine in alto */}
      <View className="w-full aspect-square overflow-hidden">
        <Image uri={item.cover} style={{width: "100%", height: "100%"}} />
      </View>


      {/* Testi sotto */}
      <View className="p-2.5">
        <Text className="text-sm font-semibold mb-1 leading-tight" numberOfLines={2}>
          {item.name}
        </Text>

        {item.description && (
          <Text variant="muted" className="text-xs mb-1.5 leading-tight" numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Info eventi compatta */}
        {item.events && item.events.length > 0 && item.events[0].yearStart && (
          <Text variant="muted" className="text-[10px]">
            📅 {item.events[0].dayStart}/{item.events[0].monthStart}/
            {item.events[0].yearStart}
          </Text>
        )}
      </View>
    </Card>
  );
};
