import React from "react";
import {View} from "react-native";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {Card} from "@/components/ui/card";
import {router} from "expo-router";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover?: string | null;
  published?: string | null;
  author: {
    id: string;
    name: string;
    image?: string | null;
    slug?: string | null;
  } | null;
}

interface ArticleCardProps {
  article: Article;
  /**
   * Callback custom onPress (sovrascrive la navigazione default)
   */
  onPress?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/articles/${article.slug}`);
    }
  };

  return (
    <Card pressable={true} onPress={handlePress} className="overflow-hidden">
      <View className="flex-row p-4 gap-4">
        {/* Immagine a sinistra (40%) */}
        <View className="w-[40%] aspect-square overflow-hidden rounded-lg">
          <Image uri={article.cover} style={{width: "100%", height: "100%"}} />
        </View>

        {/* Contenuto a destra (60%) */}
        <View className="flex-1">
          {/* Meta in alto */}
          <View className="flex-row justify-between items-center mb-2">
            {article.published ? (
              <Text variant="caption" className="text-zinc-500 dark:text-zinc-500">
                {new Date(article.published).toLocaleDateString("it-IT")}
              </Text>
            ) : (
              <View className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700">
                <Text variant="caption" className="font-medium text-gray-600 dark:text-gray-300">
                  Bozza
                </Text>
              </View>
            )}
            {article.author?.image && (
              <Image 
                uri={article.author.image} 
                style={{width: 24, height: 24, borderRadius: 12}} 
              />
            )}
          </View>

          {/* Titolo */}
          <Text variant="heading" className="leading-6 mb-2" numberOfLines={2}>
            {article.title}
          </Text>

          {/* Excerpt */}
          {article.excerpt && (
            <Text variant="body" className="leading-5 flex-1 text-zinc-600 dark:text-zinc-400" numberOfLines={2}>
              {article.excerpt}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};
