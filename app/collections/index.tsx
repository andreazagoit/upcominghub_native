import {useQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React from "react";
import {FlatList, Pressable, View} from "react-native";
import {graphql} from "@/graphql/generated";
import type {GetCollectionsQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Loading} from "@/components/ui/loading";
import {ErrorView} from "@/components/ui/error-view";
import {Button} from "@/components/ui/button";

const GET_COLLECTIONS = graphql(`
  query GetCollections($parentSlug: String) {
    collections(parentSlug: $parentSlug) {
      slug
      name
      description
      isFeatured
    }
  }
`);

type Collection = NonNullable<GetCollectionsQuery["collections"]>[0];

const CollectionsScreen = () => {
  const {data, loading, error, refetch} = useQuery<GetCollectionsQuery>(
    GET_COLLECTIONS,
    {
      variables: {
        parentSlug: undefined,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const renderCollection = ({item}: {item: Collection}) => (
    <Pressable
      className="rounded-2xl mb-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-950 p-4"
      onPress={() => router.push(`/collections/${item.slug}`)}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text
          variant="subtitle"
          className="flex-1 leading-snug"
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {item.isFeatured && (
          <View className="px-2 py-1 rounded-xl ml-2 bg-blue-600 dark:bg-blue-500">
            <Text variant="caption">⭐</Text>
          </View>
        )}
      </View>
      {item.description && (
        <Text
          variant="caption"
          className="leading-5 text-zinc-600 dark:text-zinc-400"
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}
    </Pressable>
  );

  if (loading && !data) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Loading message="Caricamento collezioni..." />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ErrorView 
          message={error?.message || "Impossibile caricare le collezioni"}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const collections = data?.collections || [];

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {collections.length > 0 && (
        <View className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <Text variant="title" className="mb-1">Collezioni</Text>
          <Text variant="caption" className="text-zinc-600 dark:text-zinc-400">
            {collections.length} collezioni disponibili
          </Text>
        </View>
      )}

      {collections.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <Text className="text-6xl mb-4">🗂️</Text>
          <Text variant="title" className="mb-2 text-center">
            Nessuna collezione disponibile
          </Text>
          <Text variant="caption" className="text-center mb-6 text-zinc-600 dark:text-zinc-400">
            Le collezioni saranno disponibili presto
          </Text>
          <Button onPress={() => router.push("/(main)/explore" as any)}>
            Esplora contenuti
          </Button>
        </View>
      ) : (
        <FlatList
          data={collections}
          renderItem={renderCollection}
          keyExtractor={(item) => item.slug}
          contentContainerClassName="p-5"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default CollectionsScreen;
