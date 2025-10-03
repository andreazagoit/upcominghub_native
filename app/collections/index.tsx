import {useQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {graphql} from "@/graphql/generated";
import type {GetCollectionsQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {useColorScheme} from "@/hooks/use-color-scheme";

const GET_COLLECTIONS = graphql(`
  query GetCollections($parentSlug: String) {
    collections(parentSlug: $parentSlug) {
      slug
      name
      description
      isFeatured
    }
  }
`);

type Collection = NonNullable<GetCollectionsQuery["collections"]>[0];

const CollectionsScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {data, loading, error, refetch} = useQuery<GetCollectionsQuery>(
    GET_COLLECTIONS,
    {
      variables: {
        parentSlug: undefined,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const renderCollection = ({item}: {item: Collection}) => (
    <Pressable
      style={[
        styles.collectionCard,
        {
          backgroundColor: isDark ? "#09090b" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
        },
      ]}
      onPress={() => router.push(`/collections/${item.slug}`)}
    >
      <View style={styles.collectionContent}>
        <View style={styles.collectionHeader}>
          <Text
            style={[
              styles.collectionTitle,
              {color: isDark ? "#ffffff" : "#111827"},
            ]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          {item.isFeatured && (
            <View
              style={[
                styles.featuredBadge,
                {backgroundColor: isDark ? "#3b82f6" : "#2563eb"},
              ]}
            >
              <Text style={styles.featuredText}>⭐</Text>
            </View>
          )}
        </View>
        {item.description && (
          <Text
            variant="secondary"
            style={styles.collectionDescription}
            numberOfLines={3}
          >
            {item.description}
          </Text>
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
            Caricamento collezioni...
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
            {error?.message || "Impossibile caricare le collezioni"}
          </Text>
          <Button onPress={() => refetch()} style={styles.retryButton}>
            Riprova
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const collections = data?.collections || [];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDark ? "#000000" : "#ffffff"},
      ]}
      edges={["left", "right"]}
    >
      {collections.length > 0 && (
        <View
          style={[
            styles.header,
            {borderBottomColor: isDark ? "#374151" : "#e5e7eb"},
          ]}
        >
          <Text style={styles.headerTitle}>Collezioni</Text>
          <Text variant="secondary" style={styles.collectionCount}>
            {collections.length} collezioni disponibili
          </Text>
        </View>
      )}

      {collections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🗂️</Text>
          <Text
            style={[styles.emptyTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          >
            Nessuna collezione disponibile
          </Text>
          <Text variant="secondary" style={styles.emptyText}>
            Le collezioni saranno disponibili presto
          </Text>
          <Button
            onPress={() => router.push("/(main)/explore")}
            style={styles.exploreButton}
          >
            Esplora contenuti
          </Button>
        </View>
      ) : (
        <FlatList
          data={collections}
          renderItem={renderCollection}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
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
    marginBottom: 24,
  },
  exploreButton: {
    minWidth: 200,
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
  collectionCount: {
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
  },
  columnWrapper: {
    gap: 16,
  },
  collectionCard: {
    flex: 1,
    maxWidth: "48%",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 140,
  },
  collectionContent: {
    padding: 16,
  },
  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    lineHeight: 22,
  },
  featuredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  featuredText: {
    fontSize: 12,
  },
  collectionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CollectionsScreen;
