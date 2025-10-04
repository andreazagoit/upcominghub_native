import {useLazyQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React, {useState} from "react";
import {Alert, Pressable, ScrollView, View} from "react-native";
import {graphql} from "@/graphql/generated";
import type {GetUserEventsQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {Loading} from "@/components/ui/loading";
import {Image} from "@/components/ui/image";
import {EventResumeCard} from "@/components/event-resume-card";
import {useAuth} from "@/hooks/use-auth";

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

const AccountScreen = () => {
  const {user, logout} = useAuth();
  const [activeTab, setActiveTab] = useState<"events" | "profile">("events");
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

  const [fetchEvents] = useLazyQuery<GetUserEventsQuery>(GET_USER_EVENTS);

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

  const handleLogout = async () => {
    Alert.alert("Logout", "Sei sicuro di voler uscire?", [
      {
        text: "Annulla",
        style: "cancel",
      },
      {
        text: "Esci",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Loading message="Caricamento profilo..." />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}
      >
        {/* Header con immagine profilo */}
        <View className="items-center px-5 pt-5 pb-6">
          <View className="mb-4">
            {user.image ? (
              <Image uri={user.image} style={{width: 120, height: 120, borderRadius: 60}} />
            ) : (
              <View className="w-[120px] h-[120px] rounded-full bg-gray-200 dark:bg-gray-700 justify-center items-center">
                <Text className="text-5xl font-semibold text-blue-600 dark:text-blue-500">
                  {getInitials(user.name)}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-3xl font-bold mb-1">
            {user.name}
          </Text>
          <Text variant="secondary" className="text-sm mb-3">
            @{user.slug}
          </Text>

          {user.bio && (
            <Text variant="secondary" className="text-sm text-center leading-5 px-5">
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
            <Text className={`text-sm font-semibold ${
              activeTab === "events" 
                ? "text-blue-600 dark:text-blue-500" 
                : "text-gray-500 dark:text-gray-400"
            }`}>
              📅 Eventi ({allEvents.length})
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 py-3 items-center rounded-lg ${
              activeTab === "profile" ? "border-b-2 border-blue-600 dark:border-blue-500" : ""
            }`}
            onPress={() => setActiveTab("profile")}
          >
            <Text className={`text-sm font-semibold ${
              activeTab === "profile" 
                ? "text-blue-600 dark:text-blue-500" 
                : "text-gray-500 dark:text-gray-400"
            }`}>
              👤 Profilo
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
                  <Text variant="secondary" className="text-sm text-center">
                    Nessun evento disponibile
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === "profile" && (
            <View className="mb-6">
              {/* Info personali */}
              <View className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 mb-5">
                <Text className="text-lg font-semibold mb-4">
                  Informazioni Personali
                </Text>

                <View className="py-3 border-b border-gray-100 dark:border-zinc-900">
                  <Text variant="muted" className="text-xs uppercase mb-1">
                    Email
                  </Text>
                  <Text className="text-base">
                    {user.email}
                  </Text>
                </View>

                {user.role && (
                  <View className="py-3 border-b border-gray-100 dark:border-zinc-900">
                    <Text variant="muted" className="text-xs uppercase mb-1">
                      Ruolo
                    </Text>
                    <Text className="text-base">
                      {user.role}
                    </Text>
                  </View>
                )}

                {user.type && (
                  <View className="py-3 border-b border-gray-100 dark:border-zinc-900">
                    <Text variant="muted" className="text-xs uppercase mb-1">
                      Tipo Account
                    </Text>
                    <Text className="text-base">
                      {user.type}
                    </Text>
                  </View>
                )}

                <View className="py-3">
                  <Text variant="muted" className="text-xs uppercase mb-1">
                    Email Verificata
                  </Text>
                  <Text className={user.emailVerified ? "text-emerald-500" : "text-amber-500"}>
                    {user.emailVerified ? "✓ Verificata" : "✗ Non verificata"}
                  </Text>
                </View>
              </View>

              {/* Logout button */}
              <View className="pb-10">
                <Button
                  onPress={handleLogout}
                  variant="outline"
                  className="mt-5 border-red-600 dark:border-red-500"
                >
                  <Text className="text-red-600 dark:text-red-500">
                    🚪 Logout
                  </Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountScreen;
