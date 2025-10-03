import {Button} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {useColorScheme} from "@/hooks/use-color-scheme";
import React, {useState} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useQuery} from "@apollo/client/react";
import {graphql} from "@/graphql/generated";
import type {GetFavoriteCalendarQuery} from "@/graphql/generated/graphql";
import {router} from "expo-router";

const {width} = Dimensions.get("window");

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

const CalendarScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const {data, loading, error, refetch} = useQuery<GetFavoriteCalendarQuery>(
    GET_FAVORITE_CALENDAR,
    {
      variables: {page: 1, limit: 100},
      fetchPolicy: "cache-and-network",
    }
  );

  const events = data?.favoriteCalendarEvents?.data || [];

  // Generate calendar days for current month
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Helper to check if a day has events
  const hasEventsOnDay = (day: number) => {
    return events.some(
      (event: any) =>
        event.dayStart === day &&
        event.monthStart === month + 1 &&
        event.yearStart === year
    );
  };

  // Get events for current month
  const monthEvents = events.filter(
    (event: any) => event.monthStart === month + 1 && event.yearStart === year
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
            Caricamento calendario...
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
            {error?.message || "Impossibile caricare il calendario"}
          </Text>
          <Button onPress={() => refetch()} style={styles.retryButton}>
            Riprova
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: isDark ? "#000000" : "#ffffff"},
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.emptyContainer}
        >
          <Text style={styles.emptyIcon}>📅</Text>
          <Text
            style={[styles.emptyTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          >
            Nessun rilascio nei preferiti
          </Text>
          <Text variant="secondary" style={styles.emptyText}>
            Aggiungi item e collezioni ai tuoi preferiti per vedere i loro
            rilasci qui.
          </Text>
          <View style={styles.emptyActions}>
            <Button onPress={() => router.push("/(main)/explore")}>
              Esplora contenuti
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: isDark ? "#000000" : "#ffffff"},
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}>
            Calendario Preferiti
          </Text>
          <Text variant="secondary" style={styles.subtitle}>
            {monthNames[month]} {year}
          </Text>
        </View>

        {/* Calendar Grid */}
        <View
          style={[
            styles.calendarContainer,
            {
              backgroundColor: isDark ? "#111827" : "#ffffff",
              borderRadius: 16,
              padding: 16,
              marginHorizontal: 20,
            },
          ]}
        >
          {/* Day names header */}
          <View style={styles.dayNamesRow}>
            {dayNames.map((day) => (
              <Text
                key={day}
                style={[
                  styles.dayName,
                  {color: isDark ? "#9ca3af" : "#6b7280"},
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar days */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <Pressable
                key={index}
                style={[
                  styles.dayCell,
                  day
                    ? {
                        backgroundColor: isDark ? "#1f2937" : "#f8fafc",
                        borderColor: isDark ? "#374151" : "#e2e8f0",
                        borderWidth: 1,
                      }
                    : {
                        backgroundColor: "transparent",
                        borderWidth: 0,
                      },
                ]}
              >
                {day && (
                  <>
                    <Text
                      style={[
                        styles.dayText,
                        {color: isDark ? "#ffffff" : "#111827"},
                      ]}
                    >
                      {day}
                    </Text>
                    {hasEventsOnDay(day) && (
                      <View
                        style={[styles.eventDot, {backgroundColor: "#3b82f6"}]}
                      />
                    )}
                  </>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Events Section */}
        {monthEvents.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {color: isDark ? "#ffffff" : "#111827"},
              ]}
            >
              Rilasci di {monthNames[month]}
            </Text>
            {monthEvents.map((event: any) => (
              <Pressable
                key={event.id}
                style={[
                  styles.eventItem,
                  {
                    backgroundColor: isDark ? "#1f2937" : "#ffffff",
                    borderColor: isDark ? "#374151" : "#e5e7eb",
                  },
                ]}
              >
                {event.cover && (
                  <Image
                    source={{uri: event.cover}}
                    style={styles.eventCover}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.eventContent}>
                  <Text
                    style={[
                      styles.eventTitle,
                      {color: isDark ? "#ffffff" : "#111827"},
                    ]}
                    numberOfLines={2}
                  >
                    {event.name}
                  </Text>
                  {event.item && (
                    <Text variant="secondary" style={styles.eventItem}>
                      🎯 {event.item.name}
                    </Text>
                  )}
                  <Text variant="secondary" style={styles.eventTime}>
                    📅 {event.dayStart} {monthNames[event.monthStart - 1]}{" "}
                    {event.yearStart}
                    {event.timeStart && ` • ${event.timeStart}`}
                  </Text>
                  {event.description && (
                    <Text
                      variant="secondary"
                      style={styles.eventDescription}
                      numberOfLines={2}
                    >
                      {event.description}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  retryButton: {
    minWidth: 120,
  },
  emptyContainer: {
    flexGrow: 1,
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
  emptyActions: {
    minWidth: 200,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  calendarContainer: {
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayNamesRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: width / 7 - 4,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 8,
    borderWidth: 1,
    position: "relative",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
  },
  eventDot: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
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
  eventItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventCover: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
    marginTop: 4,
  },
  eventDescription: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default CalendarScreen;
