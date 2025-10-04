import {useQuery, useLazyQuery} from "@apollo/client/react";
import {router, useLocalSearchParams} from "expo-router";
import React, {useState} from "react";
import {ScrollView, View, Pressable} from "react-native";
import {graphql} from "@/graphql/generated";
import type {
  GetUserProfileQuery,
  GetUserEventsQuery,
} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {Image} from "@/components/ui/image";
import {EventResumeCard} from "@/components/event-resume-card";
import {CollectionCard} from "@/components/collection-card";
import {Loading} from "@/components/ui/loading";
import {ErrorView} from "@/components/ui/error-view";

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
      <View className="flex-1 bg-white dark:bg-black">
        <Loading message="Caricamento profilo..." />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ErrorView 
          message={error?.message || "L'utente che stai cercando non esiste o è stato rimosso"}
          onRetry={() => router.back()}
          retryText="Torna indietro"
        />
      </View>
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
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con immagine profilo */}
        <View className="items-center px-5 pt-5 pb-6">
          <View className="mb-4">
            {user.image ? (
              <Image uri={user.image} style={{width: 120, height: 120, borderRadius: 60}} />
            ) : (
              <View className="w-[120px] h-[120px] rounded-full justify-center items-center bg-gray-200 dark:bg-gray-700">
                <Text variant="title" className="text-blue-600 dark:text-blue-500">
                  {getInitials(user.name)}
                </Text>
              </View>
            )}
          </View>

          <Text variant="title" className="mb-1">
            {user.name}
          </Text>
          <Text variant="caption" className="mb-3 text-zinc-600 dark:text-zinc-400">
            @{user.slug}
          </Text>

          {user.bio && (
            <Text variant="caption" className="text-center leading-5 px-5 text-zinc-600 dark:text-zinc-400">
              {user.bio}
            </Text>
          )}
        </View>

        {/* Tabs */}
        <View className="flex-row px-5 mb-5 gap-3">
          <Pressable
            className={`flex-1 py-3 items-center rounded-lg ${
              activeTab === "events" ? "border-b-2 border-blue-600 dark:border-blue-500" : ""
            }`}
            onPress={() => setActiveTab("events")}
          >
            <Text variant="caption" className={`font-semibold ${
              activeTab === "events" 
                ? "text-blue-600 dark:text-blue-500" 
                : "text-gray-500 dark:text-gray-400"
            }`}>
              📅 Eventi ({allEvents.length})
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 py-3 items-center rounded-lg ${
              activeTab === "favorites" ? "border-b-2 border-blue-600 dark:border-blue-500" : ""
            }`}
            onPress={() => setActiveTab("favorites")}
          >
            <Text variant="caption" className={`font-semibold ${
              activeTab === "favorites" 
                ? "text-blue-600 dark:text-blue-500" 
                : "text-gray-500 dark:text-gray-400"
            }`}>
              ❤️ Preferiti ({favoriteCollections.length})
            </Text>
          </Pressable>
        </View>

        {/* Contenuto Tab */}
        <View className="px-5">
          {activeTab === "events" && (
            <View className="mb-6">
              {allEvents.length > 0 ? (
                <>
                  <View className="gap-3">
                    {allEvents.map((event) => (
                      <EventResumeCard key={event.id} event={event} />
                    ))}
                  </View>
                  {pagination?.hasNextPage && (
                    <View className="mt-5 items-center">
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
                <View className="items-center py-10">
                  <Text className="text-6xl mb-4">📅</Text>
                  <Text variant="caption" className="text-center text-zinc-600 dark:text-zinc-400">
                    Nessun evento disponibile
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === "favorites" && (
            <View className="mb-6">
              {favoriteCollections.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-3"
                >
                  {favoriteCollections.map((collection) => (
                    <View key={collection.slug}>
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
                <View className="items-center py-10">
                  <Text className="text-6xl mb-4">❤️</Text>
                  <Text variant="caption" className="text-center text-zinc-600 dark:text-zinc-400">
                    Nessuna collezione nei preferiti
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Back Button */}
        <View className="px-5 pb-10">
          <Button
            onPress={() => router.back()}
            variant="outline"
            className="mt-5"
          >
            ← Torna indietro
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserProfileScreen;

