import {useQuery} from "@apollo/client/react";
import {router} from "expo-router";
import React from "react";
import {FlatList, Pressable, View} from "react-native";
import {graphql} from "@/graphql/generated";
import type {GetArticlesQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Image} from "@/components/ui/image";
import {Loading} from "@/components/ui/loading";
import {ErrorView} from "@/components/ui/error-view";

const GET_ARTICLES = graphql(`
  query GetArticles($filter: ArticlesFilterInput) {
    articles(filter: $filter) {
      data {
        id
        title
        content
        excerpt
        slug
        published
        createdAt
        updatedAt
        author {
          id
          name
          email
          image
          createdAt
          updatedAt
          role
          slug
          type
        }
        cover
        collections {
          id
          name
          slug
          description
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

type Article = NonNullable<GetArticlesQuery["articles"]>["data"][0];

const ArticlesScreen = () => {
  const {data, loading, error, refetch} = useQuery<GetArticlesQuery>(
    GET_ARTICLES,
    {
      variables: {
        filter: {
          page: 1,
          limit: 20,
          language: "it",
        },
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const renderArticle = ({item}: {item: Article}) => (
    <Pressable
      className="rounded-2xl mb-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-950 overflow-hidden"
      onPress={() => router.push(`/articles/${item.slug}`)}
    >
      {item.cover && (
        <Image
          uri={item.cover}
          style={{width: "100%", height: 200}}
        />
      )}
      <View className="p-4">
        <Text
          variant="subheading"
          className="mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        {item.excerpt && (
          <Text
            variant="caption"
            className="leading-5 mb-3 text-zinc-600 dark:text-zinc-400"
            numberOfLines={3}
          >
            {item.excerpt}
          </Text>
        )}
        <View className="flex-row justify-between items-center mb-2">
          {item.author && (
            <Text variant="caption" className="font-medium text-zinc-600 dark:text-zinc-400">
              di {item.author.name}
            </Text>
          )}
          <Text variant="caption" className="text-zinc-500 dark:text-zinc-500">
            {new Date(item.createdAt).toLocaleDateString("it-IT")}
          </Text>
        </View>
        {item.collections && item.collections.length > 0 && (
          <View className="flex-row flex-wrap gap-1.5 mt-2">
            {item.collections.slice(0, 3).map((collection) => (
              <View
                key={collection.id}
                className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700"
              >
                <Text
                  variant="caption"
                  className="text-[11px] font-medium text-gray-700 dark:text-gray-300"
                >
                  {collection.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );

  if (loading && !data) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Loading message="Caricamento articoli..." />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ErrorView 
          message={error?.message || "Impossibile caricare gli articoli"}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const articles = data?.articles?.data || [];

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {data?.articles?.pagination && (
        <View className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <Text variant="title" className="mb-1">Articoli</Text>
          <Text variant="caption" className="text-zinc-600 dark:text-zinc-400">
            {data.articles.pagination.total} articoli disponibili
          </Text>
        </View>
      )}

      {articles.length === 0 ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-6xl mb-4">📰</Text>
          <Text variant="title" className="mb-2 text-center">
            Nessun articolo disponibile
          </Text>
          <Text variant="caption" className="text-center text-zinc-600 dark:text-zinc-400">
            Gli articoli saranno disponibili presto
          </Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="p-5"
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ArticlesScreen;
