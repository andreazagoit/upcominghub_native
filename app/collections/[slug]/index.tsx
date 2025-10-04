import {useQuery, useMutation} from "@apollo/client/react";
import {router, useLocalSearchParams, Stack} from "expo-router";
import React, {useState} from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {Image} from "@/components/ui/image";
import {graphql} from "@/graphql/generated";
import type {GetCollectionQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {CollectionCard} from "@/components/collection-card";

const TOGGLE_COLLECTION_FAVORITE = graphql(`
  mutation ToggleCollectionFavorite($collectionSlug: String!) {
    toggleCollectionFavorite(collectionSlug: $collectionSlug) {
      isFavorite
      success
      message
    }
  }
`);

const GET_COLLECTION = graphql(`
  query GetCollection($slug: String!, $page: Int, $limit: Int) {
    collection(slug: $slug) {
      slug
      name
      description
      isFeatured
      isFavorite
      collections {
        slug
        name
        description
        isFeatured
      }
      events(page: $page, limit: $limit) {
        data {
          id
          name
          description
          cover
          yearStart
          monthStart
          dayStart
          timeStart
          yearEnd
          monthEnd
          dayEnd
          timeEnd
          item {
            slug
            name
          }
          availability {
            id
            platform
            link
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
  }
`);

type Event = NonNullable<
  NonNullable<GetCollectionQuery["collection"]>["events"]
>["data"][0];
type SubCollection = NonNullable<
  NonNullable<GetCollectionQuery["collection"]>["collections"]
>[0];

const CollectionDetailScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {slug} = useLocalSearchParams<{slug: string}>();
  const [isFavorite, setIsFavorite] = useState(false);

  const {data, loading, error, refetch} = useQuery<GetCollectionQuery>(
    GET_COLLECTION,
    {
      variables: {
        slug: slug as string,
        page: 1,
        limit: 50,
      },
      skip: !slug,
      fetchPolicy: "cache-and-network",
    }
  );

  const [toggleFavorite, {loading: toggleLoading}] = useMutation(
    TOGGLE_COLLECTION_FAVORITE
  );

  const collection = data?.collection;
  const events = collection?.events?.data || [];
  const subcollections = collection?.collections || [];

  // Update local isFavorite state when data loads
  React.useEffect(() => {
    if (collection?.isFavorite !== undefined) {
      setIsFavorite(collection.isFavorite);
    }
  }, [collection?.isFavorite]);

  const handleToggleFavorite = async () => {
    if (!slug) return;

    try {
      const {data: result} = await toggleFavorite({
        variables: {collectionSlug: slug as string},
      });

      if (result?.toggleCollectionFavorite?.success) {
        setIsFavorite(result.toggleCollectionFavorite.isFavorite);
        refetch();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{title: "Collezione"}} />
        <View
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
              Caricamento collezione...
            </Text>
          </View>
        </View>
      </>
    );
  }

  if (error || !collection) {
    return (
      <>
        <Stack.Screen options={{title: "Collezione"}} />
        <View
          style={[
            styles.container,
            {backgroundColor: isDark ? "#000000" : "#ffffff"},
          ]}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.emptyIcon}>🗂️</Text>
            <Text
              style={[
                styles.errorTitle,
                {color: isDark ? "#ffffff" : "#111827"},
              ]}
            >
              {error ? "Errore nel caricamento" : "Collezione non trovata"}
            </Text>
            <Text variant="secondary" style={styles.errorText}>
              {error?.message ||
                "La collezione che stai cercando non esiste o è stata rimossa"}
            </Text>
            <Button onPress={() => router.back()} style={styles.backButton}>
              Torna indietro
            </Button>
          </View>
        </View>
      </>
    );
  }

  const renderEvent = ({item}: {item: Event}) => (
    <Pressable
      style={[
        styles.eventCard,
        {
          backgroundColor: isDark ? "#09090b" : "#ffffff",
          borderColor: isDark ? "#374151" : "#e5e7eb",
        },
      ]}
      onPress={() => item.item?.slug && router.push(`/items/${item.item.slug}`)}
    >
      <Image uri={item.cover} style={styles.eventCover} />
      <View style={styles.eventContent}>
        <Text
          style={[styles.eventTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {item.item && (
          <Text variant="secondary" style={styles.eventItem}>
            🎯 {item.item.name}
          </Text>
        )}
        {item.dayStart && item.monthStart && item.yearStart && (
          <Text variant="muted" style={styles.eventDate}>
            📅 {item.dayStart}/{item.monthStart}/{item.yearStart}
            {item.timeStart && ` • ${item.timeStart}`}
          </Text>
        )}
        {item.description && (
          <Text
            variant="secondary"
            style={styles.eventDescription}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
      </View>
    </Pressable>
  );


  return (
    <>
      <Stack.Screen
        options={{
          title: collection.name,
          headerRight: () => (
            <Pressable
              onPress={handleToggleFavorite}
              disabled={toggleLoading}
              style={styles.headerButton}
            >
              {toggleLoading ? (
                <ActivityIndicator size="small" color={isDark ? "#3b82f6" : "#2563eb"} />
              ) : (
                <Text style={styles.heartIcon}>
                  {isFavorite ? "❤️" : "🤍"}
                </Text>
              )}
            </Pressable>
          ),
        }}
      />
      <View
        style={[
          styles.container,
          {backgroundColor: isDark ? "#000000" : "#ffffff"},
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}>
            {collection.name}
          </Text>
          {collection.description && (
            <Text variant="secondary" style={styles.description}>
              {collection.description}
            </Text>
          )}
        </View>

        {/* Collections */}
        {subcollections.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {color: isDark ? "#ffffff" : "#111827"},
              ]}
            >
              Collezioni
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {subcollections.map((collection) => (
                <View key={collection.slug} style={styles.collectionCardWrapper}>
                  <CollectionCard
                    collection={{
                      slug: collection.slug,
                      name: collection.name,
                      description: collection.description,
                      isFeatured: collection.isFeatured,
                    }}
                    width={280}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Events */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {color: isDark ? "#ffffff" : "#111827"},
            ]}
          >
            Eventi e Rilasci
          </Text>
          {events.length === 0 ? (
            <View style={styles.emptyEventsContainer}>
              <Text style={styles.emptyEventsIcon}>📅</Text>
              <Text variant="secondary" style={styles.emptyEventsText}>
                Nessun evento disponibile per questa collezione
              </Text>
            </View>
          ) : (
            <View style={styles.eventsContainer}>
              {events.map((event) => (
                <View key={event.id}>{renderEvent({item: event})}</View>
              ))}
            </View>
          )}
        </View>

        {/* Back Button */}
        <View style={styles.footer}>
          <Button
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButtonBottom}
          >
            ← Torna alle collezioni
          </Button>
        </View>
      </ScrollView>
    </View>
    </>
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
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  collectionCardWrapper: {
    width: 280,
  },
  eventsContainer: {
    paddingHorizontal: 20,
  },
  eventCard: {
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
  eventCover: {
    width: "100%",
    height: 180,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  eventItem: {
    fontSize: 13,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyEventsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyEventsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyEventsText: {
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButtonBottom: {
    marginTop: 20,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  heartIcon: {
    fontSize: 24,
  },
});

export default CollectionDetailScreen;
