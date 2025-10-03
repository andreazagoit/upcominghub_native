import {gql} from "@apollo/client";
import {useQuery} from "@apollo/client/react";
import {router, useLocalSearchParams} from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const GET_ARTICLE_BY_SLUG = gql`
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
`;

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  cover?: string;
  collections: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  }[];
}

interface ArticleData {
  article: Article;
}

const ArticleDetailScreen = () => {
  const {slug} = useLocalSearchParams<{slug: string}>();

  const {data, loading, error} = useQuery<ArticleData>(GET_ARTICLE_BY_SLUG, {
    variables: {slug},
    skip: !slug,
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0f172a" />
          <Text style={styles.loadingText}>Loading article...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading article</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!data?.article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const {article} = data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.metaContainer}>
            <Text style={styles.authorName}>By {article.author.name}</Text>
            <Text style={styles.publishDate}>
              {new Date(article.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {article.excerpt && (
            <Text style={styles.excerpt}>{article.excerpt}</Text>
          )}

          {article.collections.length > 0 && (
            <View style={styles.collectionsContainer}>
              <Text style={styles.collectionsTitle}>Collections:</Text>
              <View style={styles.collectionsList}>
                {article.collections.map((collection) => (
                  <View key={collection.id} style={styles.collectionTag}>
                    <Text style={styles.collectionText}>{collection.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{article.content}</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Published on {new Date(article.createdAt).toLocaleDateString()}
            </Text>
            {article.updatedAt !== article.createdAt && (
              <Text style={styles.footerText}>
                Last updated {new Date(article.updatedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#9ca3af",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    lineHeight: 36,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  authorName: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  publishDate: {
    fontSize: 14,
    color: "#9ca3af",
  },
  excerpt: {
    fontSize: 16,
    color: "#d1d5db",
    lineHeight: 24,
    fontStyle: "italic",
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1f2937",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ffffff",
  },
  collectionsContainer: {
    marginBottom: 24,
  },
  collectionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  collectionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  collectionTag: {
    backgroundColor: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  collectionText: {
    fontSize: 12,
    color: "#d1d5db",
    fontWeight: "500",
  },
  contentContainer: {
    marginBottom: 32,
  },
  contentText: {
    fontSize: 16,
    color: "#ffffff",
    lineHeight: 26,
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#374151",
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
});

export default ArticleDetailScreen;
