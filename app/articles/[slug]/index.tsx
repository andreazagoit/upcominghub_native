import {useQuery} from "@apollo/client/react";
import {router, useLocalSearchParams} from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {graphql} from "@/graphql/generated";
import type {GetArticleBySlugQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {useColorScheme} from "@/hooks/use-color-scheme";

const GET_ARTICLE_BY_SLUG = graphql(`
  query GetArticleBySlug($slug: String!) {
    article(slug: $slug) {
      id
      title
      content
      excerpt
      slug
      published
      createdAt
      updatedAt
      author {
        id
        name
        email
        image
        slug
      }
      cover
      collections {
        id
        name
        slug
        description
      }
    }
  }
`);

const ArticleDetailScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {slug} = useLocalSearchParams<{slug: string}>();

  const {data, loading, error} = useQuery<GetArticleBySlugQuery>(
    GET_ARTICLE_BY_SLUG,
    {
      variables: {slug: slug as string},
      skip: !slug,
      fetchPolicy: "cache-and-network",
    }
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: isDark ? "#000000" : "#ffffff"},
        ]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={isDark ? "#3b82f6" : "#2563eb"}
          />
          <Text variant="secondary" style={styles.loadingText}>
            Caricamento articolo...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: isDark ? "#000000" : "#ffffff"},
        ]}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Errore nel caricamento</Text>
          <Text variant="secondary" style={styles.errorText}>
            {error.message}
          </Text>
          <Button onPress={() => router.back()} style={styles.backButton}>
            Torna indietro
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (!data?.article) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: isDark ? "#000000" : "#ffffff"},
        ]}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.emptyIcon}>📰</Text>
          <Text
            style={[styles.errorTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          >
            Articolo non trovato
          </Text>
          <Text variant="secondary" style={styles.errorText}>
            L'articolo che stai cercando non esiste o è stato rimosso
          </Text>
          <Button onPress={() => router.back()} style={styles.backButton}>
            Torna indietro
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const {article} = data;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDark ? "#000000" : "#ffffff"},
      ]}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {article.cover && (
          <Image
            source={{uri: article.cover}}
            style={styles.coverImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <Text style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}>
            {article.title}
          </Text>

          {article.author && (
            <View
              style={[
                styles.metaContainer,
                {borderBottomColor: isDark ? "#374151" : "#e5e7eb"},
              ]}
            >
              <View style={styles.authorInfo}>
                {article.author.image && (
                  <Image
                    source={{uri: article.author.image}}
                    style={styles.authorAvatar}
                  />
                )}
                <View>
                  <Text variant="secondary" style={styles.authorName}>
                    di {article.author.name}
                  </Text>
                  <Text variant="muted" style={styles.publishDate}>
                    {new Date(article.createdAt).toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {article.excerpt && (
            <View
              style={[
                styles.excerptContainer,
                {
                  backgroundColor: isDark ? "#1f2937" : "#f8fafc",
                  borderLeftColor: isDark ? "#3b82f6" : "#2563eb",
                },
              ]}
            >
              <Text
                variant="secondary"
                style={[
                  styles.excerpt,
                  {color: isDark ? "#d1d5db" : "#374151"},
                ]}
              >
                {article.excerpt}
              </Text>
            </View>
          )}

          {article.collections && article.collections.length > 0 && (
            <View style={styles.collectionsContainer}>
              <Text
                style={[
                  styles.collectionsTitle,
                  {color: isDark ? "#ffffff" : "#111827"},
                ]}
              >
                Collezioni:
              </Text>
              <View style={styles.collectionsList}>
                {article.collections.map((collection) => (
                  <Pressable
                    key={collection.id}
                    style={[
                      styles.collectionTag,
                      {
                        backgroundColor: isDark ? "#374151" : "#f3f4f6",
                        borderColor: isDark ? "#4b5563" : "#e5e7eb",
                      },
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
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.contentContainer}>
            <Text
              style={[
                styles.contentText,
                {color: isDark ? "#ffffff" : "#111827"},
              ]}
            >
              {article.content}
            </Text>
          </View>

          <View
            style={[
              styles.footer,
              {borderTopColor: isDark ? "#374151" : "#e5e7eb"},
            ]}
          >
            <Text variant="muted" style={styles.footerText}>
              Pubblicato il{" "}
              {new Date(article.createdAt).toLocaleDateString("it-IT", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            {article.updatedAt !== article.createdAt && (
              <Text variant="muted" style={styles.footerText}>
                Ultimo aggiornamento{" "}
                {new Date(article.updatedAt).toLocaleDateString("it-IT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            )}
          </View>

          <Button
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButtonBottom}
          >
            ← Torna agli articoli
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  coverImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
    marginBottom: 16,
  },
  metaContainer: {
    paddingBottom: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  publishDate: {
    fontSize: 12,
  },
  excerptContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 24,
  },
  excerpt: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },
  collectionsContainer: {
    marginBottom: 24,
  },
  collectionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  collectionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  collectionTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  collectionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  contentContainer: {
    marginBottom: 32,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
  },
  footer: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
  backButtonBottom: {
    marginBottom: 40,
  },
});

export default ArticleDetailScreen;
