import {gql} from "@apollo/client";
import {useQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const GET_ARTICLES = gql`
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
    image?: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    slug: string;
    type: string;
  };
  cover?: string;
  collections: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  }[];
}

interface ArticlesData {
  articles: {
    data: Article[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

const ArticlesScreen = () => {
  const {data, loading, error} = useQuery<ArticlesData>(GET_ARTICLES);

  const renderArticle = ({item}: {item: Article}) => (
    <Pressable
      style={styles.articleCard}
      onPress={() => router.push(`/articles/${item.slug}`)}
    >
      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleExcerpt}>{item.excerpt}</Text>
      <View style={styles.articleMeta}>
        <Text style={styles.authorName}>By {item.author.name}</Text>
        <Text style={styles.publishDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      {item.collections.length > 0 && (
        <View style={styles.collectionsContainer}>
          {item.collections.map((collection) => (
            <View key={collection.id} style={styles.collectionTag}>
              <Text style={styles.collectionText}>{collection.name}</Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading articles</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {data?.articles.pagination && (
        <View style={styles.header}>
          <Text style={styles.articleCount}>
            {data.articles.pagination.total} articles
          </Text>
        </View>
      )}
      <FlatList
        data={data?.articles.data || []}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 100, // Compensa l'header trasparente
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
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  articleCount: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  listContainer: {
    padding: 20,
  },
  articleCard: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    color: "#9ca3af",
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
    color: "#ffffff",
    fontWeight: "500",
  },
  publishDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  collectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  collectionTag: {
    backgroundColor: "#374151",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  collectionText: {
    fontSize: 11,
    color: "#d1d5db",
    fontWeight: "500",
  },
});

export default ArticlesScreen;
