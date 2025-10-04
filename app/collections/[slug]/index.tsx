import {useQuery, useMutation} from "@apollo/client/react";
import {router, useLocalSearchParams, Stack} from "expo-router";
import React, {useState} from "react";
import {Pressable, ScrollView, View} from "react-native";
import {Image} from "@/components/ui/image";
import {graphql} from "@/graphql/generated";
import type {GetCollectionQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {CollectionCard} from "@/components/collection-card";
import {Loading} from "@/components/ui/loading";
import {ErrorView} from "@/components/ui/error-view";

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
        <View className="flex-1 bg-white dark:bg-black">
          <Loading message="Caricamento collezione..." />
        </View>
      </>
    );
  }

  if (error || !collection) {
    return (
      <>
        <Stack.Screen options={{title: "Collezione"}} />
        <View className="flex-1 bg-white dark:bg-black">
          <ErrorView 
            message={error?.message || "La collezione che stai cercando non esiste o è stata rimossa"}
            onRetry={() => router.back()}
            retryText="Torna indietro"
          />
        </View>
      </>
    );
  }

  const renderEvent = ({item}: {item: Event}) => (
    <Pressable
      className="rounded-2xl mb-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-950 overflow-hidden"
      onPress={() => item.item?.slug && router.push(`/items/${item.item.slug}`)}
    >
      <View className="w-full h-[180px]">
        <Image uri={item.cover} style={{width: "100%", height: 180}} />
      </View>
      <View className="p-4">
        <Text
          variant="subtitle"
          className="mb-1.5"
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {item.item && (
          <Text variant="caption" className="mb-1 text-zinc-600 dark:text-zinc-400">
            🎯 {item.item.name}
          </Text>
        )}
        {item.dayStart && item.monthStart && item.yearStart && (
          <Text variant="caption" className="mb-2 text-zinc-500 dark:text-zinc-500">
            📅 {item.dayStart}/{item.monthStart}/{item.yearStart}
            {item.timeStart && ` • ${item.timeStart}`}
          </Text>
        )}
        {item.description && (
          <Text
            variant="body"
            className="leading-5 text-zinc-600 dark:text-zinc-400"
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
              className="p-2"
            >
              {toggleLoading ? (
                <Loading size="small" />
              ) : (
                <Text className="text-2xl">
                  {isFavorite ? "❤️" : "🤍"}
                </Text>
              )}
            </Pressable>
          ),
        }}
      />
      <View className="flex-1 bg-white dark:bg-black">
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-6 pb-8">
          <Text variant="title" className="mb-2">
            {collection.name}
          </Text>
          {collection.description && (
            <Text className="leading-6 text-zinc-600 dark:text-zinc-400">
              {collection.description}
            </Text>
          )}
        </View>

        {/* Collections */}
        {subcollections.length > 0 && (
          <View className="mb-8">
            <Text variant="subtitle" className="px-5 mb-4">
              Collezioni
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="px-5 gap-3"
            >
              {subcollections.map((collection) => (
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
          </View>
        )}

        {/* Events */}
        <View className="mb-8">
          <Text variant="subtitle" className="px-5 mb-4">
            Eventi e Rilasci
          </Text>
          {events.length === 0 ? (
            <View className="items-center py-10 px-5">
              <Text className="text-6xl mb-4">📅</Text>
              <Text variant="caption" className="text-center text-zinc-600 dark:text-zinc-400">
                Nessun evento disponibile per questa collezione
              </Text>
            </View>
          ) : (
            <View className="px-5">
              {events.map((event) => (
                <View key={event.id}>{renderEvent({item: event})}</View>
              ))}
            </View>
          )}
        </View>

        {/* Back Button */}
        <View className="px-5 py-6 border-t border-gray-200 dark:border-gray-700 mb-5">
          <Button
            onPress={() => router.back()}
            variant="outline"
          >
            ← Torna alle collezioni
          </Button>
        </View>
      </ScrollView>
    </View>
    </>
  );
};

export default CollectionDetailScreen;
