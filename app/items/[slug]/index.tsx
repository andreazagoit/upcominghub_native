import {useQuery} from "@apollo/client/react";
import {router, useLocalSearchParams} from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {graphql} from "@/graphql/generated";
import type {GetItemQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {Image} from "@/components/ui/image";
import {Card} from "@/components/ui/card";
import {EventResumeCard} from "@/components/event-resume-card";
import {useColorScheme} from "@/hooks/use-color-scheme";

const GET_ITEM = graphql(`
  query GetItem($slug: String!) {
    item(slug: $slug) {
      id
      slug
      name
      description
      content
      createdAt
      updatedAt
      cover
      isFavorite
      author {
        id
        name
        image
        slug
      }
      collections {
        id
        name
        slug
        description
      }
      events {
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
        availability {
          id
          platform
          link
        }
      }
    }
  }
`);

const ItemDetailScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {slug} = useLocalSearchParams<{slug: string}>();

  const {data, loading, error} = useQuery<GetItemQuery>(GET_ITEM, {
    variables: {slug: slug as string},
    skip: !slug,
    fetchPolicy: "cache-and-network",
  });

  const item = data?.item;

  // Calcola il primo evento e se è già disponibile
  const firstEvent = item?.events?.[0];
  const eventDate =
    firstEvent?.yearStart && firstEvent?.monthStart && firstEvent?.dayStart
      ? new Date(
          firstEvent.yearStart,
          firstEvent.monthStart - 1,
          firstEvent.dayStart
        )
      : null;
  const isAvailable = eventDate ? eventDate <= new Date() : false;

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
            Caricamento item...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {backgroundColor: isDark ? "#000000" : "#ffffff"},
        ]}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text
            style={[styles.errorTitle, {color: isDark ? "#ffffff" : "#111827"}]}
          >
            {error ? "Errore nel caricamento" : "Item non trovato"}
          </Text>
          <Text variant="secondary" style={styles.errorText}>
            {error?.message ||
              "L'item che stai cercando non esiste o è stato rimosso"}
          </Text>
          <Button onPress={() => router.back()} style={styles.backButton}>
            Torna indietro
          </Button>
        </View>
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
        {/* Hero Section con sfondo grigio scuro */}
        <View
          style={[
            styles.heroSection,
            {backgroundColor: isDark ? "#09090b" : "#ffffff"},
          ]}
        >
          {/* Cover Image */}
          {item.cover && (
            <View style={styles.coverWrapper}>
              <Image uri={item.cover} style={styles.coverImage} />
            </View>
          )}

          {/* Content Hero */}
          <View style={styles.heroContent}>
            <Text
              style={[styles.title, {color: isDark ? "#ffffff" : "#111827"}]}
            >
              {item.name}
            </Text>
            {item.description && (
              <Text
                style={[
                  styles.description,
                  {color: isDark ? "#e5e7eb" : "#6b7280"},
                ]}
              >
                {item.description}
              </Text>
            )}

            {/* Author Info */}
            {item.author && (
              <Pressable
                style={styles.authorContainer}
                onPress={() =>
                  item.author?.slug && router.push(`/users/${item.author.slug}`)
                }
              >
                {item.author.image && (
                  <Image uri={item.author.image} style={styles.authorAvatar} />
                )}
                <View>
                  <Text
                    style={[
                      styles.authorLabel,
                      {color: isDark ? "#9ca3af" : "#6b7280"},
                    ]}
                  >
                    Creato da
                  </Text>
                  <Text
                    style={[
                      styles.authorName,
                      {color: isDark ? "#ffffff" : "#111827"},
                    ]}
                  >
                    {item.author.name}
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>

        {/* Disponibilità Card - Se c'è almeno un evento */}
        {firstEvent && eventDate && (
          <View style={styles.section}>
            <Card style={styles.availabilityCard}>
              <View style={styles.availabilityHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    {backgroundColor: isDark ? "#3b82f6" : "#dbeafe"},
                  ]}
                >
                  <Text style={styles.iconText}>📅</Text>
                </View>
                <View style={styles.availabilityHeaderText}>
                  <Text
                    style={[
                      styles.availabilityTitle,
                      {color: isDark ? "#ffffff" : "#111827"},
                    ]}
                  >
                    Disponibilità
                  </Text>
                  <Text variant="secondary" style={styles.availabilitySubtitle}>
                    {isAvailable ? "Disponibile dal" : "In arrivo"}
                  </Text>
                </View>
              </View>
              <View style={styles.availabilityContent}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: isAvailable
                        ? isDark
                          ? "#3b82f6"
                          : "#2563eb"
                        : isDark
                        ? "#6b7280"
                        : "#9ca3af",
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {isAvailable ? "Disponibile" : "Prossimamente"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.eventDateLarge,
                    {color: isDark ? "#ffffff" : "#111827"},
                  ]}
                >
                  {eventDate.toLocaleDateString("it-IT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
                {firstEvent.name && (
                  <Text variant="muted" style={styles.eventName}>
                    {firstEvent.name}
                  </Text>
                )}
                {item.events && item.events.length > 1 && (
                  <Text variant="muted" style={styles.moreEvents}>
                    + {item.events.length - 1} altr
                    {item.events.length - 1 === 1 ? "o" : "i"} event
                    {item.events.length - 1 === 1 ? "o" : "i"}
                  </Text>
                )}
              </View>
            </Card>
          </View>
        )}

        {/* Informazioni Card */}
        <View style={styles.section}>
          <Card style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <View
                style={[
                  styles.iconCircle,
                  {backgroundColor: isDark ? "#8b5cf6" : "#ede9fe"},
                ]}
              >
                <Text style={styles.iconText}>📦</Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.infoCardTitle,
                    {color: isDark ? "#ffffff" : "#111827"},
                  ]}
                >
                  Informazioni
                </Text>
                <Text variant="secondary" style={styles.infoCardSubtitle}>
                  Dettagli item
                </Text>
              </View>
            </View>

            <View style={styles.infoCardContent}>
              {/* Collections */}
              {item.collections && item.collections.length > 0 && (
                <View style={styles.infoRow}>
                  <Text variant="muted" style={styles.infoLabel}>
                    Collezioni
                  </Text>
                  <View style={styles.collectionsGrid}>
                    {item.collections.map((collection) => (
                      <Pressable
                        key={collection.id}
                        style={[
                          styles.collectionTag,
                          {
                            backgroundColor: isDark ? "#374151" : "#f3f4f6",
                            borderColor: isDark ? "#4b5563" : "#e5e7eb",
                          },
                        ]}
                        onPress={() =>
                          router.push(`/collections/${collection.slug}`)
                        }
                      >
                        <Text
                          style={[
                            styles.collectionText,
                            {color: isDark ? "#d1d5db" : "#374151"},
                          ]}
                        >
                          {collection.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {/* Date Created */}
              <View style={styles.infoRow}>
                <Text variant="muted" style={styles.infoLabel}>
                  Creato
                </Text>
                <Text variant="secondary" style={styles.infoValue}>
                  {new Date(item.createdAt).toLocaleDateString("it-IT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              {/* Last Updated */}
              <View style={styles.infoRow}>
                <Text variant="muted" style={styles.infoLabel}>
                  Ultimo aggiornamento
                </Text>
                <Text variant="secondary" style={styles.infoValue}>
                  {new Date(item.updatedAt).toLocaleDateString("it-IT", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Events Section */}
        {item.events && item.events.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {color: isDark ? "#ffffff" : "#111827"},
              ]}
            >
              Eventi
            </Text>
            <View style={styles.eventsContainer}>
              {item.events.map((event) => (
                <EventResumeCard key={event.id} event={event} />
              ))}
            </View>
          </View>
        )}

        {/* Content */}
        {item.content && (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                {color: isDark ? "#ffffff" : "#111827"},
              ]}
            >
              Descrizione
            </Text>
            <Text
              style={[
                styles.contentText,
                {color: isDark ? "#e5e7eb" : "#374151"},
              ]}
            >
              {item.content}
            </Text>
          </View>
        )}

        {/* Back Button */}
        <View style={styles.footer}>
          <Button
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButtonBottom}
          >
            ← Torna agli items
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
  // Hero Section
  heroSection: {
    marginBottom: 24,
    padding: 20,
  },
  coverWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    aspectRatio: 1,
  },
  heroContent: {
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  authorLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  // Availability Card
  availabilityCard: {
    padding: 20,
  },
  availabilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
  },
  availabilityHeaderText: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  availabilitySubtitle: {
    fontSize: 13,
  },
  availabilityContent: {
    gap: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
  },
  eventDateLarge: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventName: {
    fontSize: 12,
  },
  moreEvents: {
    fontSize: 12,
  },
  // Info Card
  infoCard: {
    padding: 20,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  infoCardSubtitle: {
    fontSize: 13,
  },
  infoCardContent: {
    gap: 16,
  },
  infoRow: {
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  collectionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  collectionTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  collectionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Events
  eventsContainer: {
    gap: 0,
  },
  // Content
  contentText: {
    fontSize: 16,
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  backButtonBottom: {
    marginTop: 8,
  },
});

export default ItemDetailScreen;
