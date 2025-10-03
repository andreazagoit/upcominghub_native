import React from "react";
import {StyleSheet, View} from "react-native";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {Card} from "@/components/ui/card";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {router} from "expo-router";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover?: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
    slug?: string | null;
  } | null;
  collections?: {
    id: string;
    name: string;
    slug: string;
  }[] | null;
}

interface ArticleCardProps {
  article: Article;
  /**
   * Se true, mostra la cover image
   */
  showCover?: boolean;
  /**
   * Se true, mostra le collections
   */
  showCollections?: boolean;
  /**
   * Numero massimo di collections da mostrare
   */
  maxCollections?: number;
  /**
   * Callback custom onPress (sovrascrive la navigazione default)
   */
  onPress?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  showCover = true,
  showCollections = true,
  maxCollections = 3,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/articles/${article.slug}`);
    }
  };

  return (
    <Card pressable={true} onPress={handlePress} style={styles.card}>
      {showCover && article.cover && (
        <View style={styles.coverContainer}>
          <Image
            uri={article.cover}
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
          {article.title}
        </Text>

        {article.excerpt && (
          <Text variant="secondary" style={styles.excerpt} numberOfLines={3}>
            {article.excerpt}
          </Text>
        )}

        <View style={styles.meta}>
          {article.author && (
            <Text variant="secondary" style={styles.author}>
              di {article.author.name}
            </Text>
          )}
          <Text variant="muted" style={styles.date}>
            {new Date(article.createdAt).toLocaleDateString("it-IT")}
          </Text>
        </View>

        {showCollections &&
          article.collections &&
          article.collections.length > 0 && (
            <View style={styles.collectionsContainer}>
              {article.collections
                .slice(0, maxCollections)
                .map((collection) => (
                  <View
                    key={collection.id}
                    style={[
                      styles.collectionTag,
                      {backgroundColor: isDark ? "#374151" : "#f3f4f6"},
                    ]}
                  >
                    <Text
                      style={[
                        styles.collectionText,
                        {color: isDark ? "#d1d5db" : "#374151"},
                      ]}
                    >
                      {collection.name}
                    </Text>
                  </View>
                ))}
            </View>
          )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
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
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
  },
  collectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  collectionTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  collectionText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
