import React from "react";
import {View, type DimensionValue} from "react-native";
import {Text} from "@/components/ui/text";
import {Card} from "@/components/ui/card";
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
      style={width ? {width} : undefined}
      className="min-h-[120px] min-w-[200px]"
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text variant="heading" className="flex-1 leading-snug" numberOfLines={2}>
            {collection.name}
          </Text>
          {collection.isFeatured && (
            <View className="px-2 py-1 rounded-xl ml-2 bg-blue-600 dark:bg-blue-600">
              <Text variant="caption">⭐</Text>
            </View>
          )}
        </View>
        {collection.description && (
          <Text variant="body" className="leading-5 text-zinc-600 dark:text-zinc-400" numberOfLines={2}>
            {collection.description}
          </Text>
        )}
      </View>
    </Card>
  );
};
