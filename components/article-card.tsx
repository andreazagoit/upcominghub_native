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
      <View style={styles.container}>
        {/* Immagine a sinistra */}
        <View style={styles.imageContainer}>
          <Image uri={article.cover} style={styles.coverImage} />
        </View>

        {/* Contenuto a destra */}
        <View style={styles.content}>
          {/* Meta in alto */}
          <View style={styles.header}>
            {article.published ? (
              <Text variant="muted" style={styles.date}>
                {new Date(article.published).toLocaleDateString("it-IT")}
              </Text>
            ) : (
              <View
                style={[
                  styles.unpublishedBadge,
                  {backgroundColor: isDark ? "#374151" : "#f3f4f6"},
                ]}
              >
                <Text
                  style={[
                    styles.unpublishedText,
                    {color: isDark ? "#d1d5db" : "#6b7280"},
                  ]}
                >
                  Bozza
                </Text>
              </View>
            )}
            {article.author?.image && (
              <Image uri={article.author.image} style={styles.authorAvatar} />
            )}
          </View>

          {/* Titolo */}
          <Text
            style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}
            numberOfLines={2}
          >
            {article.title}
          </Text>

          {/* Excerpt */}
          {article.excerpt && (
            <Text variant="secondary" style={styles.excerpt} numberOfLines={2}>
              {article.excerpt}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  container: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  imageContainer: {
    width: "40%",
    aspectRatio: 1,
  },
  coverImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
  },
  unpublishedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unpublishedText: {
    fontSize: 11,
    fontWeight: "500",
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
