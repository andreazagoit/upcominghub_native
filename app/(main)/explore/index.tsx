import {QueryState} from "@/components/ui/query-state";
import {Section} from "@/components/ui/section";
import {PageHeader} from "@/components/ui/page-header";
import React from "react";
import {ScrollView, View} from "react-native";
import {useQuery} from "@apollo/client/react";
import {graphql} from "@/graphql/generated";
import type {GetHomepageQuery} from "@/graphql/generated/graphql";
import {ItemCard} from "@/components/item-card";
import {ArticleCard} from "@/components/article-card";
import {CollectionCard} from "@/components/collection-card";
import {EventResumeCard} from "@/components/event-resume-card";

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
  const {loading, error, data, refetch} = useQuery<GetHomepageQuery>(GET_HOMEPAGE, {
    fetchPolicy: "cache-and-network",
  });

  const homepage = data?.homepage;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <QueryState
        loading={loading && !data}
        error={error}
        data={homepage}
        loadingMessage="Caricamento della homepage..."
        errorMessage={error?.message || "Impossibile caricare i contenuti"}
        onRetry={() => refetch()}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 40}}
        >
          <PageHeader
            title="Esplora"
            description="Scopri le ultime novità e i prossimi rilasci"
          />

          {/* Popular Items */}
          {homepage?.popularItems && homepage.popularItems.length > 0 && (
            <Section
              title="Items Popolari"
              description="Gli items più amati dalla community"
              viewAllLink="/items"
              noPadding
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 20, gap: 12}}
              >
                {homepage.popularItems.map((item: any) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </ScrollView>
            </Section>
          )}

          {/* Latest Articles */}
          {homepage?.latestArticles && homepage.latestArticles.length > 0 && (
            <Section
              title="Ultimi Articoli"
              description="Le notizie più recenti dal mondo tech"
              viewAllLink="/articles"
            >
              <View className="gap-4">
                {homepage.latestArticles.slice(0, 4).map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </View>
            </Section>
          )}

          {/* Trending Collections */}
          {homepage?.trendingCollections && homepage.trendingCollections.length > 0 && (
            <Section
              title="Collezioni"
              description="Le collezioni più popolari del momento"
              viewAllLink="/collections"
              viewAllText="Vedi tutte →"
              noPadding
            >
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
            </Section>
          )}

          {/* Upcoming Events */}
          {homepage?.upcomingEvents && homepage.upcomingEvents.length > 0 && (
            <Section
              title="Prossimi Eventi"
              description="Cosa aspettarsi nei prossimi mesi"
            >
              <View className="gap-3">
                {homepage.upcomingEvents.slice(0, 5).map((event: any) => (
                  <EventResumeCard key={event.id} event={event} />
                ))}
              </View>
            </Section>
          )}
        </ScrollView>
      </QueryState>
    </View>
  );
};

export default ExploreScreen;
