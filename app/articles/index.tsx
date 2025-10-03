import {useQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {graphql} from "@/graphql/generated";
import type {GetArticlesQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {useColorScheme} from "@/hooks/use-color-scheme";

const GET_ARTICLES = graphql(`
  query GetArticles($filter: ArticlesFilterInput) {
    articles(filter: $filter) {
      data {
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
          createdAt
          updatedAt
          role
          slug
          type
        }
        cover
        collections {
          id
          name
          slug
          description
        }
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`);

type Article = NonNullable<GetArticlesQuery["articles"]>["data"][0];

const ArticlesScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {data, loading, error, refetch} = useQuery<GetArticlesQuery>(
    GET_ARTICLES,
    {
      variables: {
        filter: {
          page: 1,
          limit: 20,
          language: "it",
        },
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const renderArticle = ({item}: {item: Article}) => (
    <Pressable
      style={[
        styles.articleCard,
        {
          backgroundColor: isDark ? "#09090b" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
        },
      ]}
      onPress={() => router.push(`/articles/${item.slug}`)}
    >
      {item.cover && (
        <Image
          source={{uri: item.cover}}
          style={styles.articleCover}
          resizeMode="cover"
        />
      )}
      <View style={styles.articleContent}>
        <Text
          style={[styles.articleTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        {item.excerpt && (
          <Text
            variant="secondary"
            style={styles.articleExcerpt}
            numberOfLines={3}
          >
            {item.excerpt}
          </Text>
        )}
        <View style={styles.articleMeta}>
          <Text variant="secondary" style={styles.authorName}>
            di {item.author.name}
          </Text>
          <Text variant="muted" style={styles.publishDate}>
            {new Date(item.createdAt).toLocaleDateString("it-IT")}
          </Text>
        </View>
        {item.collections && item.collections.length > 0 && (
          <View style={styles.collectionsContainer}>
            {item.collections.slice(0, 3).map((collection) => (
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
    </Pressable>
  );

  if (loading && !data) {
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
            Caricamento articoli...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
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
            {error?.message || "Impossibile caricare gli articoli"}
          </Text>
          <Button onPress={() => refetch()} style={styles.retryButton}>
            Riprova
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const articles = data?.articles?.data || [];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDark ? "#000000" : "#ffffff"},
      ]}
      edges={["left", "right"]}
    >
      {data?.articles?.pagination && (
        <View
          style={[
            styles.header,
            {borderBottomColor: isDark ? "#374151" : "#e5e7eb"},
          ]}
        >
          <Text style={styles.headerTitle}>Articoli</Text>
          <Text variant="secondary" style={styles.articleCount}>
            {data.articles.pagination.total} articoli disponibili
          </Text>
        </View>
      )}

      {articles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📰</Text>
          <Text
            style={[styles.emptyTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          >
            Nessun articolo disponibile
          </Text>
          <Text variant="secondary" style={styles.emptyText}>
            Gli articoli saranno disponibili presto
          </Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100, // Compensa l'header trasparente
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
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  articleCount: {
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
  },
  articleCard: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  articleCover: {
    width: "100%",
    height: 200,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  authorName: {
    fontSize: 12,
    fontWeight: "500",
  },
  publishDate: {
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

export default ArticlesScreen;
