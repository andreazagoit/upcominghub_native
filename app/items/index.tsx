import {useQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {graphql} from "@/graphql/generated";
import type {GetItemsQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {useColorScheme} from "@/hooks/use-color-scheme";

const {width} = Dimensions.get("window");

const GET_ITEMS = graphql(`
  query GetItems($page: Int, $limit: Int, $searchTerm: String) {
    items(page: $page, limit: $limit, searchTerm: $searchTerm) {
      data {
        id
        slug
        name
        description
        cover
        isFavorite
        events {
          id
          name
          yearStart
          monthStart
          dayStart
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

type Item = NonNullable<GetItemsQuery["items"]>["data"][0];

const ItemsScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {data, loading, error, refetch} = useQuery<GetItemsQuery>(GET_ITEMS, {
    variables: {
      page: 1,
      limit: 20,
      searchTerm: undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const renderItem = ({item}: {item: Item}) => (
    <Pressable
      style={[
        styles.itemCard,
        {
          backgroundColor: isDark ? "#09090b" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
        },
      ]}
      onPress={() => router.push(`/items/${item.slug}`)}
    >
      {item.cover && (
        <Image
          source={{uri: item.cover}}
          style={styles.itemCover}
          resizeMode="cover"
        />
      )}
      <View style={styles.itemContent}>
        <Text
          style={[styles.itemTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {item.description && (
          <Text
            variant="secondary"
            style={styles.itemDescription}
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}
        {item.events && item.events.length > 0 && (
          <View style={styles.eventsInfo}>
            <Text variant="muted" style={styles.eventsCount}>
              📅 {item.events.length} event
              {item.events.length !== 1 ? "i" : "o"}
            </Text>
            {item.events[0].yearStart && (
              <Text variant="muted" style={styles.nextEvent}>
                Prossimo: {item.events[0].dayStart}/{item.events[0].monthStart}/
                {item.events[0].yearStart}
              </Text>
            )}
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
            Caricamento items...
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
            {error?.message || "Impossibile caricare gli items"}
          </Text>
          <Button onPress={() => refetch()} style={styles.retryButton}>
            Riprova
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const items = data?.items?.data || [];
  const pagination = data?.items?.pagination;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDark ? "#000000" : "#ffffff"},
      ]}
      edges={["left", "right"]}
    >
      {pagination && (
        <View
          style={[
            styles.header,
            {borderBottomColor: isDark ? "#374151" : "#e5e7eb"},
          ]}
        >
          <Text style={styles.headerTitle}>Items</Text>
          <Text variant="secondary" style={styles.itemCount}>
            {pagination.total} items disponibili
          </Text>
        </View>
      )}

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text
            style={[styles.emptyTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          >
            Nessun item disponibile
          </Text>
          <Text variant="secondary" style={styles.emptyText}>
            Gli items saranno disponibili presto
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
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
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
  itemCount: {
    fontSize: 14,
  },
  listContainer: {
    padding: 20,
  },
  columnWrapper: {
    gap: 16,
  },
  itemCard: {
    flex: 1,
    maxWidth: (width - 56) / 2,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemCover: {
    width: "100%",
    height: 140,
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 22,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  eventsInfo: {
    marginTop: 8,
    paddingTop: 8,
    gap: 4,
  },
  eventsCount: {
    fontSize: 11,
  },
  nextEvent: {
    fontSize: 11,
  },
});

export default ItemsScreen;
