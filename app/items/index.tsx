import {useQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React from "react";
import {FlatList, Pressable, View} from "react-native";
import {graphql} from "@/graphql/generated";
import type {GetItemsQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {Loading} from "@/components/ui/loading";
import {ErrorView} from "@/components/ui/error-view";
import {Button} from "@/components/ui/button";

const GET_ITEMS = graphql(`
  query GetItems($page: Int, $limit: Int, $searchTerm: String) {
    items(page: $page, limit: $limit, searchTerm: $searchTerm) {
      data {
        id
        slug
        name
        description
        cover
        isFavorite
        events {
          id
          name
          yearStart
          monthStart
          dayStart
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

type Item = NonNullable<GetItemsQuery["items"]>["data"][0];

const ItemsScreen = () => {
  const {data, loading, error, refetch} = useQuery<GetItemsQuery>(GET_ITEMS, {
    variables: {
      page: 1,
      limit: 20,
      searchTerm: undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const renderItem = ({item}: {item: Item}) => (
    <Pressable
      className="rounded-2xl mb-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-950 overflow-hidden"
      onPress={() => router.push(`/items/${item.slug}`)}
    >
      {item.cover && (
        <View className="w-full h-[200px]">
          <Image
            uri={item.cover}
            style={{width: "100%", height: 200}}
          />
        </View>
      )}
      <View className="p-4">
        <Text
          variant="subtitle"
          className="mb-2"
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {item.description && (
          <Text
            variant="caption"
            className="leading-5 mb-3 text-zinc-600 dark:text-zinc-400"
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}
        {item.events && item.events.length > 0 && (
          <View className="gap-1">
            <Text variant="caption" className="text-zinc-500 dark:text-zinc-500">
              📅 {item.events.length} event
              {item.events.length !== 1 ? "i" : "o"}
            </Text>
            {item.events[0].yearStart && (
              <Text variant="caption" className="text-zinc-500 dark:text-zinc-500">
                Prossimo: {item.events[0].dayStart}/{item.events[0].monthStart}/
                {item.events[0].yearStart}
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );

  if (loading && !data) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Loading message="Caricamento items..." />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ErrorView 
          message={error?.message || "Impossibile caricare gli items"}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const items = data?.items?.data || [];
  const pagination = data?.items?.pagination;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {pagination && (
        <View className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <Text variant="title" className="mb-1">Items</Text>
          <Text variant="caption" className="text-zinc-600 dark:text-zinc-400">
            {pagination.total} items disponibili
          </Text>
        </View>
      )}

      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <Text className="text-6xl mb-4">📦</Text>
          <Text variant="title" className="mb-2 text-center">
            Nessun item disponibile
          </Text>
          <Text variant="caption" className="text-center mb-6 text-zinc-600 dark:text-zinc-400">
            Gli items saranno disponibili presto
          </Text>
          <Button onPress={() => router.push("/(main)/explore" as any)}>
            Esplora contenuti
          </Button>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="p-5"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ItemsScreen;
