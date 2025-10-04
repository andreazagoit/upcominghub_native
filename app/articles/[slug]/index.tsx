import {useQuery} from "@apollo/client/react";
import {router, useLocalSearchParams} from "expo-router";
import React from "react";
import {Pressable, ScrollView, View} from "react-native";
import {graphql} from "@/graphql/generated";
import type {GetArticleBySlugQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {Image} from "@/components/ui/image";
import {Loading} from "@/components/ui/loading";
import {ErrorView} from "@/components/ui/error-view";

const GET_ARTICLE_BY_SLUG = graphql(`
  query GetArticleBySlug($slug: String!) {
    article(slug: $slug) {
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
        slug
      }
      cover
      collections {
        id
        name
        slug
        description
      }
    }
  }
`);

const ArticleDetailScreen = () => {
  const {slug} = useLocalSearchParams<{slug: string}>();

  const {data, loading, error} = useQuery<GetArticleBySlugQuery>(
    GET_ARTICLE_BY_SLUG,
    {
      variables: {slug: slug as string},
      skip: !slug,
      fetchPolicy: "cache-and-network",
    }
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <Loading message="Caricamento articolo..." />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ErrorView 
          message={error.message}
          onRetry={() => router.back()}
          retryText="Torna indietro"
        />
      </View>
    );
  }

  if (!data?.article) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ErrorView 
          message="L'articolo che stai cercando non esiste o è stato rimosso"
          onRetry={() => router.back()}
          retryText="Torna indietro"
        />
      </View>
    );
  }

  const {article} = data;

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {article.cover && (
          <View className="w-full h-[250px]">
            <Image
              uri={article.cover}
              style={{width: "100%", height: 250}}
            />
          </View>
        )}

        <View className="p-5">
          <Text variant="title" className="leading-9 mb-4">
            {article.title}
          </Text>

          {article.author && (
            <View className="pb-4 mb-5 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center gap-3">
                {article.author.image && (
                  <Image
                    uri={article.author.image}
                    style={{width: 48, height: 48, borderRadius: 24}}
                  />
                )}
                <View>
                  <Text variant="caption" className="font-medium mb-0.5 text-zinc-600 dark:text-zinc-400">
                    di {article.author.name}
                  </Text>
                  <Text variant="caption" className="text-zinc-500 dark:text-zinc-500">
                    {new Date(article.createdAt).toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {article.excerpt && (
            <View className="px-4 py-3 rounded-lg border-l-4 border-blue-600 dark:border-blue-500 mb-6 bg-slate-50 dark:bg-zinc-950">
              <Text className="leading-6 italic text-gray-700 dark:text-gray-300">
                {article.excerpt}
              </Text>
            </View>
          )}

          {article.collections && article.collections.length > 0 && (
            <View className="mb-6">
              <Text variant="heading" className="mb-3">
                Collezioni:
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {article.collections.map((collection) => (
                  <Pressable
                    key={collection.id}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                  >
                    <Text variant="caption" className="font-medium text-gray-700 dark:text-gray-300">
                      {collection.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View className="mb-8">
            <Text className="leading-[26px]">
              {article.content}
            </Text>
          </View>

          <View className="pt-5 pb-5 border-t border-gray-200 dark:border-gray-700 mb-5">
            <Text variant="caption" className="mb-1 text-zinc-500 dark:text-zinc-500">
              Pubblicato il{" "}
              {new Date(article.createdAt).toLocaleDateString("it-IT", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            {article.updatedAt !== article.createdAt && (
              <Text variant="caption" className="text-zinc-500 dark:text-zinc-500">
                Ultimo aggiornamento{" "}
                {new Date(article.updatedAt).toLocaleDateString("it-IT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            )}
          </View>

          <Button
            onPress={() => router.back()}
            variant="outline"
            className="mb-10"
          >
            ← Torna agli articoli
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ArticleDetailScreen;
