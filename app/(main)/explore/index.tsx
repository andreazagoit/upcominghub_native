import {Button} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {router} from "expo-router";
import React from "react";
import {ActivityIndicator, ScrollView, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useQuery} from "@apollo/client/react";
import {graphql} from "@/graphql/generated";
import type {GetHomepageQuery} from "@/graphql/generated/graphql";
import {ItemCard} from "@/components/item-card";
import {ArticleCard} from "@/components/article-card";
import {CollectionCard} from "@/components/collection-card";
import {EventResumeCard} from "@/components/event-resume-card";
import "../../../global.css";

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
  const {loading, error, data} = useQuery<GetHomepageQuery>(GET_HOMEPAGE, {
    fetchPolicy: "cache-and-network",
  });

  const homepage = data?.homepage;

  if (loading && !data) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white dark:bg-black">
        <View className="flex-1 justify-center items-center p-5">
          <ActivityIndicator size="large" className="text-blue-600 dark:text-blue-500" />
          <Text variant="secondary" className="mt-4 text-base">
            Caricamento...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !homepage) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white dark:bg-black">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-xl font-semibold mb-2">Errore nel caricamento</Text>
          <Text variant="secondary" className="text-sm text-center mb-5">
            {error?.message || "Impossibile caricare i contenuti"}
          </Text>
          <Button onPress={() => {}}>Riprova</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white dark:bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-3xl font-bold mb-1">Esplora</Text>
          <Text variant="secondary" className="text-base">
            Scopri le ultime novità e i prossimi rilasci
          </Text>
        </View>

        {/* Popular Items */}
        {homepage.popularItems && homepage.popularItems.length > 0 && (
          <View className="mb-8">
            <View className="px-5 mb-4 flex-row justify-between items-start">
              <View>
                <Text className="text-xl font-semibold mb-1">Items Popolari</Text>
                <Text variant="secondary" className="text-sm">
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
              contentContainerStyle={{paddingHorizontal: 20, gap: 12}}
            >
              {homepage.popularItems.map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Latest Articles */}
        {homepage.latestArticles && homepage.latestArticles.length > 0 && (
          <View className="mb-8">
            <View className="px-5 mb-4 flex-row justify-between items-start">
              <View>
                <Text className="text-xl font-semibold mb-1">Ultimi Articoli</Text>
                <Text variant="secondary" className="text-sm">
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
            <View className="px-5 gap-4">
              {homepage.latestArticles.slice(0, 4).map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </View>
          </View>
        )}

        {/* Trending Collections */}
        {homepage.trendingCollections &&
          homepage.trendingCollections.length > 0 && (
            <View className="mb-8">
              <View className="px-5 mb-4 flex-row justify-between items-start">
                <View>
                  <Text className="text-xl font-semibold mb-1">Collezioni</Text>
                  <Text variant="secondary" className="text-sm">
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
                contentContainerStyle={{paddingHorizontal: 20, gap: 12}}
              >
                {homepage.trendingCollections.map((collection: any) => (
                  <CollectionCard
                    key={collection.id}
                    collection={{
                      slug: collection.slug,
                      name: collection.name,
                      description: collection.description,
                      isFeatured: false,
                    }}
                    width={280}
                  />
                ))}
              </ScrollView>
            </View>
          )}

        {/* Upcoming Events */}
        {homepage.upcomingEvents && homepage.upcomingEvents.length > 0 && (
          <View className="mb-8">
            <View className="px-5 mb-4">
              <Text className="text-xl font-semibold mb-1">Prossimi Eventi</Text>
              <Text variant="secondary" className="text-sm">
                Cosa aspettarsi nei prossimi mesi
              </Text>
            </View>
            <View className="px-5 gap-3">
              {homepage.upcomingEvents.slice(0, 5).map((event: any) => (
                <EventResumeCard key={event.id} event={event} />
              ))}
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;
