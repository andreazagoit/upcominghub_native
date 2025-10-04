import {useLazyQuery, useQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React, {useState, useEffect} from "react";
import {ScrollView, View} from "react-native";
import {graphql} from "@/graphql/generated";
import type {GetFavoriteCalendarQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {Loading} from "@/components/ui/loading";
import {ErrorView} from "@/components/ui/error-view";
import {PageHeader} from "@/components/ui/page-header";
import {EventResumeCard} from "@/components/event-resume-card";

const GET_FAVORITE_CALENDAR = graphql(`
  query GetFavoriteCalendar($page: Int, $limit: Int) {
    favoriteCalendarEvents(page: $page, limit: $limit) {
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
        isItemFavorite
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
  NonNullable<GetFavoriteCalendarQuery["favoriteCalendarEvents"]>["data"]
>[0];

type Pagination = NonNullable<
  GetFavoriteCalendarQuery["favoriteCalendarEvents"]
>["pagination"];

const CalendarScreen = () => {
  const limit = 20;
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const {data, loading, error, refetch} = useQuery<GetFavoriteCalendarQuery>(
    GET_FAVORITE_CALENDAR,
    {
      variables: {page: 1, limit},
      fetchPolicy: "cache-and-network",
    }
  );

  const [fetchMoreEvents] = useLazyQuery<GetFavoriteCalendarQuery>(
    GET_FAVORITE_CALENDAR,
    {fetchPolicy: "cache-first"}
  );

  // Initialize data
  useEffect(() => {
    if (data?.favoriteCalendarEvents) {
      const events = data.favoriteCalendarEvents.data || [];
      const paginationInfo = data.favoriteCalendarEvents.pagination;

      setAllEvents(events);
      if (paginationInfo) {
        setPagination(paginationInfo);
      }
    }
  }, [data]);

  const loadMore = async () => {
    if (!pagination?.hasNextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const {data: moreData} = await fetchMoreEvents({
        variables: {
          page: pagination.page + 1,
          limit: pagination.limit,
        },
      });

      const newEvents = moreData?.favoriteCalendarEvents?.data || [];
      const newPagination = moreData?.favoriteCalendarEvents?.pagination;

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

  // Group events by date
  const groupEventsByDate = (events: Event[]) => {
    const groups: {
      [year: string]: {
        [month: string]: {
          [day: string]: Event[];
        };
      };
    } = {};

    events.forEach((event) => {
      const year = event.yearStart?.toString() || "Unknown";
      const month = event.monthStart?.toString() || "Unknown";
      const day = event.dayStart?.toString() || "Unknown";

      if (!groups[year]) groups[year] = {};
      if (!groups[year][month]) groups[year][month] = {};
      if (!groups[year][month][day]) groups[year][month][day] = [];

      groups[year][month][day].push(event);
    });

    return groups;
  };

  const groupedEvents = groupEventsByDate(allEvents);

  // Loading state
  if (loading && !data) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Loading message="Caricamento calendario..." />
        </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ErrorView
          message={error.message || "Impossibile caricare il calendario"}
          onRetry={() => refetch()}
        />
        </View>
    );
  }

  // Empty state
  if (allEvents.length === 0) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ScrollView contentContainerStyle={{paddingBottom: 40}}>
          <PageHeader
            title="Calendario Preferiti"
            description="Rilasci dei tuoi item e collezioni preferite organizzati per data"
          />
          
          <View className="items-center py-12 px-5">
            <Text className="text-6xl mb-4">📅</Text>
            <Text className="text-xl font-semibold mb-2 text-center">
            Nessun rilascio nei preferiti
          </Text>
            <Text variant="secondary" className="text-sm text-center mb-6">
              Aggiungi item e collezioni ai tuoi preferiti per vedere i loro rilasci qui.
          </Text>
            <View className="gap-3 w-full max-w-xs">
              <Button onPress={() => router.push("/items")}>
                Esplora Items
              </Button>
              <Button 
                onPress={() => router.push("/collections")}
                variant="outline"
              >
                Esplora Collezioni
            </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}
      >
        <PageHeader
          title="Calendario Preferiti"
          description="Rilasci dei tuoi item e collezioni preferite organizzati per data"
        />

        {/* Eventi raggruppati per data */}
        <View className="px-5">
          {Object.entries(groupedEvents)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([year, months]) => (
              <View key={year} className="mb-8">
                <Text className="text-2xl font-bold mb-6">{year}</Text>
                {Object.entries(months)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([month, days]) => (
                    <View key={month} className="mb-6">
                      <Text className="text-xl font-semibold mb-4">
                        {new Date(2025, parseInt(month) - 1)
                          .toLocaleDateString("it-IT", {month: "long"})
                          .toUpperCase()}
          </Text>
                      {Object.entries(days)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([day, dayEvents]) => (
                          <View key={day} className="mb-4">
                            <Text className="text-lg font-medium mb-3 text-gray-600 dark:text-gray-400">
                              {day}{" "}
                              {new Date(2025, parseInt(month) - 1)
                                .toLocaleDateString("it-IT", {month: "long"})}
          </Text>
                            <View className="gap-3">
                              {dayEvents.map((event) => (
                                <EventResumeCard key={event.id} event={event} />
                              ))}
                            </View>
                          </View>
                        ))}
        </View>
            ))}
          </View>
            ))}
        </View>

        {/* Load More */}
        {pagination?.hasNextPage && (
          <View className="px-5 mt-4">
            <Button
              onPress={loadMore}
              disabled={loadingMore}
              variant="outline"
            >
              {loadingMore ? "Caricamento..." : "Carica altri rilasci"}
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;
