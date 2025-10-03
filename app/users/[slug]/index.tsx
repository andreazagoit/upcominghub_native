import {useQuery, useLazyQuery} from "@apollo/client/react";
import {router, useLocalSearchParams} from "expo-router";
import React, {useState} from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {graphql} from "@/graphql/generated";
import type {
  GetUserProfileQuery,
  GetUserEventsQuery,
} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {Image} from "@/components/ui/image";
import {EventResumeCard} from "@/components/event-resume-card";
import {CollectionCard} from "@/components/collection-card";

const GET_USER_PROFILE = graphql(`
  query GetUserProfile($slug: String!) {
    user(slug: $slug) {
      id
      slug
      name
      email
      image
      bio
      role
      type
      collections {
        id
        slug
        name
        description
        isFeatured
      }
    }
  }
`);

const GET_USER_EVENTS = graphql(`
  query GetUserEvents($userId: String!, $page: Int!, $limit: Int!) {
    userEvents(userId: $userId, page: $page, limit: $limit) {
      data {
        id
        name
        description
        cover
        yearStart
        monthStart
        dayStart
        timeStart
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
`);

type Event = NonNullable<
  NonNullable<GetUserEventsQuery["userEvents"]>["data"]
>[0];
type Collection = NonNullable<
  NonNullable<GetUserProfileQuery["user"]>["collections"]
>[0];

const UserProfileScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {slug} = useLocalSearchParams<{slug: string}>();
  const [activeTab, setActiveTab] = useState<"events" | "favorites">("events");
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const {data, loading, error} = useQuery<GetUserProfileQuery>(
    GET_USER_PROFILE,
    {
      variables: {
        slug: slug as string,
      },
      skip: !slug,
      fetchPolicy: "cache-and-network",
    }
  );

  const [fetchEvents] = useLazyQuery<GetUserEventsQuery>(GET_USER_EVENTS);

  const user = data?.user;
  const favoriteCollections = user && Array.isArray(user.collections) ? user.collections : [];

  // Load events when user is loaded
  React.useEffect(() => {
    const loadInitialEvents = async () => {
      if (user?.id) {
        const {data: eventsData} = await fetchEvents({
          variables: {
            userId: user.id,
            page: 1,
            limit: 20,
          },
        });

        if (eventsData?.userEvents) {
          setAllEvents(eventsData.userEvents.data);
          setPagination(eventsData.userEvents.pagination);
        }
      }
    };

    loadInitialEvents();
  }, [user?.id]);

  const loadMore = async () => {
    if (!pagination?.hasNextPage || loadingMore || !user?.id) return;

    setLoadingMore(true);
    try {
      const {data: eventsData} = await fetchEvents({
        variables: {
          userId: user.id,
          page: pagination.page + 1,
          limit: pagination.limit,
        },
      });

      const newEvents = eventsData?.userEvents?.data || [];
      const newPagination = eventsData?.userEvents?.pagination;

      setAllEvents((prev) => [...prev, ...newEvents]);
      if (newPagination) {
        setPagination(newPagination);
      }
    } catch (error) {
      console.error("Error loading more events:", error);
    } finally {
      setLoadingMore(false);
    }
  };

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
            Caricamento profilo...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: isDark ? "#000000" : "#ffffff"},
        ]}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.emptyIcon}>👤</Text>
          <Text
            style={[styles.errorTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          >
            {error ? "Errore nel caricamento" : "Utente non trovato"}
          </Text>
          <Text variant="secondary" style={styles.errorText}>
            {error?.message ||
              "L'utente che stai cercando non esiste o è stato rimosso"}
          </Text>
          <Button onPress={() => router.back()} style={styles.backButton}>
            Torna indietro
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDark ? "#000000" : "#ffffff"},
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con immagine profilo */}
        <View style={styles.headerContainer}>
          <View style={styles.profileImageContainer}>
            {user.image ? (
              <Image uri={user.image} style={styles.profileImage} />
            ) : (
              <View
                style={[
                  styles.profileImagePlaceholder,
                  {backgroundColor: isDark ? "#374151" : "#e5e7eb"},
                ]}
              >
                <Text
                  style={[
                    styles.initials,
                    {color: isDark ? "#3b82f6" : "#2563eb"},
                  ]}
                >
                  {getInitials(user.name)}
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.name, {color: isDark ? "#ffffff" : "#111827"}]}>
            {user.name}
          </Text>
          <Text variant="secondary" style={styles.username}>
            @{user.slug}
          </Text>

          {user.bio && (
            <Text variant="secondary" style={styles.bio}>
              {user.bio}
            </Text>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[
              styles.tab,
              activeTab === "events" && {
                borderBottomWidth: 2,
                borderBottomColor: isDark ? "#3b82f6" : "#2563eb",
              },
            ]}
            onPress={() => setActiveTab("events")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "events"
                      ? isDark
                        ? "#3b82f6"
                        : "#2563eb"
                      : isDark
                      ? "#9ca3af"
                      : "#6b7280",
                },
              ]}
            >
              📅 Eventi ({allEvents.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === "favorites" && {
                borderBottomWidth: 2,
                borderBottomColor: isDark ? "#3b82f6" : "#2563eb",
              },
            ]}
            onPress={() => setActiveTab("favorites")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === "favorites"
                      ? isDark
                        ? "#3b82f6"
                        : "#2563eb"
                      : isDark
                      ? "#9ca3af"
                      : "#6b7280",
                },
              ]}
            >
              ❤️ Preferiti ({favoriteCollections.length})
            </Text>
          </Pressable>
        </View>

        {/* Contenuto Tab */}
        <View style={styles.content}>
          {activeTab === "events" && (
            <View style={styles.section}>
              {allEvents.length > 0 ? (
                <>
                  <View style={styles.eventsContainer}>
                    {allEvents.map((event) => (
                      <EventResumeCard key={event.id} event={event} />
                    ))}
                  </View>
                  {pagination?.hasNextPage && (
                    <View style={styles.loadMoreContainer}>
                      <Button
                        onPress={loadMore}
                        variant="outline"
                        disabled={loadingMore}
                      >
                        {loadingMore ? "Caricamento..." : "Carica altri eventi"}
                      </Button>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>📅</Text>
                  <Text variant="secondary" style={styles.emptyText}>
                    Nessun evento disponibile
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === "favorites" && (
            <View style={styles.section}>
              {favoriteCollections.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScroll}
                >
                  {favoriteCollections.map((collection) => (
                    <View
                      key={collection.slug}
                      style={styles.collectionCardWrapper}
                    >
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
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>❤️</Text>
                  <Text variant="secondary" style={styles.emptyText}>
                    Nessuna collezione nei preferiti
                  </Text>
                </View>
              )}
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
            ← Torna indietro
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
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 48,
    fontWeight: "600",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  eventsContainer: {
    gap: 12,
  },
  loadMoreContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  horizontalScroll: {
    gap: 12,
  },
  collectionCardWrapper: {
    width: 280,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
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
});

export default UserProfileScreen;

