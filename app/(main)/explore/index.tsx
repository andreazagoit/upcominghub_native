import {Button} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {router} from "expo-router";
import React, {useEffect, useState} from "react";
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
import type {GetHomepageQuery} from "@/graphql/generated/graphql";

const {width} = Dimensions.get("window");

const GET_HOMEPAGE = graphql(`
  query GetHomepage {
    homepage {
      featuredEvents {
        id
        name
        description
        yearStart
        monthStart
        dayStart
        timeStart
        item {
          slug
          name
        }
      }
      popularItems {
        id
        slug
        name
        description
        cover
        events {
          id
          name
        }
      }
      latestArticles {
        id
        title
        slug
        excerpt
        published
        author {
          name
          slug
          image
        }
        cover
      }
      trendingCollections {
        id
        slug
        name
        description
      }
      upcomingEvents {
        id
        name
        description
        yearStart
        monthStart
        dayStart
        timeStart
        item {
          slug
          name
        }
      }
    }
  }
`);

const ExploreScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {loading, error, data} = useQuery<GetHomepageQuery>(GET_HOMEPAGE, {
    fetchPolicy: "cache-and-network",
  });

  const homepage = data?.homepage;

  if (loading && !data) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
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
            Caricamento...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !homepage) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={[
          styles.container,
          {backgroundColor: isDark ? "#000000" : "#ffffff"},
        ]}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Errore nel caricamento</Text>
          <Text variant="secondary" style={styles.errorText}>
            {error?.message || "Impossibile caricare i contenuti"}
          </Text>
          <Button onPress={() => {}} style={styles.retryButton}>
            Riprova
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[
        styles.container,
        {backgroundColor: isDark ? "#000000" : "#ffffff"},
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Esplora</Text>
          <Text variant="secondary" style={styles.subtitle}>
            Scopri le ultime novità e i prossimi rilasci
          </Text>
        </View>

        {/* Popular Items */}
        {homepage.popularItems && homepage.popularItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Items Popolari</Text>
                <Text variant="secondary" style={styles.sectionDescription}>
                  Gli items più amati dalla community
                </Text>
              </View>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push("/items")}
              >
                Vedi tutti →
              </Button>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {homepage.popularItems.map((item: any) => (
                <Pressable
                  key={item.id}
                  style={[
                    styles.itemCard,
                    {backgroundColor: isDark ? "#1f2937" : "#ffffff"},
                  ]}
                  onPress={() => router.push(`/items/${item.slug}`)}
                >
                  {item.cover && (
                    <Image
                      source={{uri: item.cover}}
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
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
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Latest Articles */}
        {homepage.latestArticles && homepage.latestArticles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Ultimi Articoli</Text>
                <Text variant="secondary" style={styles.sectionDescription}>
                  Le notizie più recenti dal mondo tech
                </Text>
              </View>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push("/articles")}
              >
                Vedi tutti →
              </Button>
            </View>
            <View style={styles.articlesGrid}>
              {homepage.latestArticles.slice(0, 4).map((article: any) => (
                <Pressable
                  key={article.id}
                  style={[
                    styles.articleCard,
                    {backgroundColor: isDark ? "#1f2937" : "#ffffff"},
                  ]}
                  onPress={() => router.push(`/articles/${article.slug}`)}
                >
                  {article.cover && (
                    <Image
                      source={{uri: article.cover}}
                      style={styles.articleImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.articleContent}>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    {article.excerpt && (
                      <Text
                        variant="secondary"
                        style={styles.articleExcerpt}
                        numberOfLines={2}
                      >
                        {article.excerpt}
                      </Text>
                    )}
                    {article.author && (
                      <Text variant="muted" style={styles.articleAuthor}>
                        di {article.author.name}
                      </Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Trending Collections */}
        {homepage.trendingCollections &&
          homepage.trendingCollections.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Collezioni</Text>
                  <Text variant="secondary" style={styles.sectionDescription}>
                    Le collezioni più popolari del momento
                  </Text>
                </View>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => router.push("/collections")}
                >
                  Vedi tutte →
                </Button>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {homepage.trendingCollections.map((collection: any) => (
                  <Pressable
                    key={collection.id}
                    style={[
                      styles.collectionCard,
                      {backgroundColor: isDark ? "#1f2937" : "#ffffff"},
                    ]}
                    onPress={() =>
                      router.push(`/collections/${collection.slug}`)
                    }
                  >
                    <Text style={styles.collectionTitle}>
                      {collection.name}
                    </Text>
                    {collection.description && (
                      <Text
                        variant="secondary"
                        style={styles.collectionDescription}
                        numberOfLines={3}
                      >
                        {collection.description}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

        {/* Upcoming Events */}
        {homepage.upcomingEvents && homepage.upcomingEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Prossimi Eventi</Text>
                <Text variant="secondary" style={styles.sectionDescription}>
                  Cosa aspettarsi nei prossimi mesi
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {homepage.upcomingEvents.map((event: any) => (
                <Pressable
                  key={event.id}
                  style={[
                    styles.eventCard,
                    {backgroundColor: isDark ? "#1f2937" : "#ffffff"},
                  ]}
                  onPress={() =>
                    event.item?.slug && router.push(`/items/${event.item.slug}`)
                  }
                >
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                      {event.name}
                    </Text>
                    {event.description && (
                      <Text
                        variant="secondary"
                        style={styles.eventDescription}
                        numberOfLines={3}
                      >
                        {event.description}
                      </Text>
                    )}
                    {event.dayStart && event.monthStart && event.yearStart && (
                      <Text variant="muted" style={styles.eventDate}>
                        📅 {event.dayStart}/{event.monthStart}/{event.yearStart}
                      </Text>
                    )}
                    {event.item && (
                      <Text variant="muted" style={styles.eventItem}>
                        🎯 {event.item.name}
                      </Text>
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  // Item Cards
  itemCard: {
    width: 280,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImage: {
    width: "100%",
    height: 160,
  },
  itemContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Article Cards
  articlesGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  articleCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  articleImage: {
    width: "100%",
    height: 180,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  articleAuthor: {
    fontSize: 12,
  },
  // Collection Cards
  collectionCard: {
    width: 280,
    padding: 20,
    borderRadius: 16,
    minHeight: 120,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  collectionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Event Cards
  eventCard: {
    width: 280,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  eventItem: {
    fontSize: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ExploreScreen;
