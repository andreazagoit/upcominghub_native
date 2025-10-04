import {useQuery} from "@apollo/client/react";
import {router, Stack, useLocalSearchParams} from "expo-router";
import React, {useState} from "react";
import {Pressable, ScrollView, View} from "react-native";
import {graphql} from "@/graphql/generated";
import type {GetItemQuery} from "@/graphql/generated/graphql";
import {Text} from "@/components/ui/text";
import {Button} from "@/components/ui/button";
import {Loading} from "@/components/ui/loading";
import {ErrorView} from "@/components/ui/error-view";
import {Image} from "@/components/ui/image";
import {Card} from "@/components/ui/card";
import {BottomSheet} from "@/components/ui/bottom-sheet";
import {EventResumeCard} from "@/components/event-resume-card";

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
  const {slug} = useLocalSearchParams<{slug: string}>();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const {data, loading, error, refetch} = useQuery<GetItemQuery>(GET_ITEM, {
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
      <View className="flex-1 bg-white dark:bg-black">
        <Loading message="Caricamento item..." />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View className="flex-1 bg-white dark:bg-black">
        <ErrorView
          message={error?.message || "L'item che stai cercando non esiste o è stato rimosso"}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{title: item.name}} />
      <View className="flex-1 bg-white dark:bg-black">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View className="mb-6 p-5 bg-white dark:bg-zinc-950">
            {/* Cover Image */}
            {item.cover && (
              <View className="w-full rounded-2xl overflow-hidden">
                <Image uri={item.cover} style={{width: "100%", aspectRatio: 1}} />
              </View>
            )}

            {/* Content Hero */}
            <View className="pt-5">
              <Text className="text-3xl font-bold mb-2 leading-9">
                {item.name}
              </Text>
              {item.description && (
                <Text className="text-base leading-6 mb-4 text-gray-500 dark:text-gray-400">
                  {item.description}
                </Text>
              )}

              {/* Author Info */}
              {item.author && (
                <Pressable
                  className="flex-row items-center gap-3 mt-2"
                  onPress={() =>
                    item.author?.slug && router.push(`/users/${item.author.slug}`)
                  }
                >
                  {item.author.image && (
                    <Image 
                      uri={item.author.image} 
                      style={{width: 44, height: 44, borderRadius: 22}} 
                    />
                  )}
                  <View>
                    <Text className="text-xs mb-0.5 text-gray-500 dark:text-gray-400">
                      Creato da
                    </Text>
                    <Text className="text-sm font-semibold">
                      {item.author.name}
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          </View>

          {/* Disponibilità Card */}
          {firstEvent && eventDate && (
            <View className="mb-6 px-5">
              <Card className="p-5">
                <View className="flex-row items-center mb-4 gap-3">
                  <View className="w-10 h-10 rounded-full justify-center items-center bg-blue-100 dark:bg-blue-600">
                    <Text className="text-xl">📅</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold mb-0.5">
                      Disponibilità
                    </Text>
                    <Text variant="secondary" className="text-xs">
                      {isAvailable ? "Disponibile dal" : "In arrivo"}
                    </Text>
                  </View>
                </View>
                <View className="gap-2">
                  <View 
                    className={`self-start px-3 py-1.5 rounded-lg ${
                      isAvailable 
                        ? "bg-blue-600 dark:bg-blue-600" 
                        : "bg-gray-500 dark:bg-gray-600"
                    }`}
                  >
                    <Text className="text-xs font-semibold text-white">
                      {isAvailable ? "Disponibile" : "Prossimamente"}
                    </Text>
                  </View>
                  <Text className="text-base font-semibold">
                    {eventDate.toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  {firstEvent.name && (
                    <Text variant="muted" className="text-xs">
                      {firstEvent.name}
                    </Text>
                  )}
                  {item.events && item.events.length > 1 && (
                    <Text variant="muted" className="text-xs">
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
          <View className="mb-6 px-5">
            <Card className="p-5">
              <View className="flex-row items-center mb-4 gap-3">
                <View className="w-10 h-10 rounded-full justify-center items-center bg-purple-100 dark:bg-purple-600">
                  <Text className="text-xl">📦</Text>
                </View>
                <View>
                  <Text className="text-base font-semibold mb-0.5">
                    Informazioni
                  </Text>
                  <Text variant="secondary" className="text-xs">
                    Dettagli item
                  </Text>
                </View>
              </View>

              <View className="gap-4">
                {/* Collections */}
                {item.collections && item.collections.length > 0 && (
                  <View className="gap-2">
                    <Text variant="muted" className="text-xs">
                      Collezioni
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {item.collections.map((collection) => (
                        <Pressable
                          key={collection.id}
                          className="px-2.5 py-1.5 rounded-lg border bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          onPress={() =>
                            router.push(`/collections/${collection.slug}`)
                          }
                        >
                          <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {collection.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {/* Date Created */}
                <View className="gap-2">
                  <Text variant="muted" className="text-xs">
                    Creato
                  </Text>
                  <Text variant="secondary" className="text-sm font-medium">
                    {new Date(item.createdAt).toLocaleDateString("it-IT", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>

                {/* Last Updated */}
                <View className="gap-2">
                  <Text variant="muted" className="text-xs">
                    Ultimo aggiornamento
                  </Text>
                  <Text variant="secondary" className="text-sm font-medium">
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
            <View className="mb-6 px-5">
              <Text className="text-xl font-semibold mb-4">
                Eventi
              </Text>
              <View>
                {item.events.map((event) => (
                  <EventResumeCard 
                    key={event.id} 
                    event={event}
                    onPress={() => setSelectedEvent(event)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Content */}
          {item.content && (
            <View className="mb-6 px-5">
              <Text className="text-xl font-semibold mb-4">
                Descrizione
              </Text>
              <Text className="text-base leading-7 text-gray-700 dark:text-gray-300">
                {item.content}
              </Text>
            </View>
          )}

          {/* Back Button */}
          <View className="px-5 py-8">
            <Button
              onPress={() => router.back()}
              variant="outline"
              className="mt-2"
            >
              ← Torna agli items
            </Button>
          </View>
        </ScrollView>
      </View>

      {/* Bottom Sheet per dettagli evento */}
      <BottomSheet 
        isOpen={!!selectedEvent} 
        onOpenChange={(isOpen) => !isOpen && setSelectedEvent(null)}
      >
        {selectedEvent && (
          <View className="p-5">
            {/* Header */}
            <View className="mb-4">
              <Text className="text-2xl font-bold mb-2">
                {selectedEvent.name || "Evento"}
              </Text>
              {selectedEvent.description && (
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedEvent.description}
                </Text>
              )}
            </View>

            {/* Cover Image */}
            {selectedEvent.cover && (
              <View className="mb-4 rounded-xl overflow-hidden">
                <Image 
                  uri={selectedEvent.cover} 
                  style={{width: "100%", aspectRatio: 16/9}} 
                />
              </View>
            )}

            {/* Data evento */}
            {selectedEvent.yearStart && selectedEvent.monthStart && selectedEvent.dayStart && (
              <View className="mb-4">
                <Text variant="muted" className="text-xs mb-1">Data</Text>
                <Text className="text-base font-semibold">
                  📅 {selectedEvent.dayStart}/{selectedEvent.monthStart}/{selectedEvent.yearStart}
                  {selectedEvent.timeStart && ` - ${selectedEvent.timeStart}`}
                </Text>
              </View>
            )}

            {/* Availability */}
            {selectedEvent.availability && selectedEvent.availability.length > 0 && (
              <View className="mb-4">
                <Text variant="muted" className="text-xs mb-2">Disponibile su</Text>
                <View className="gap-2">
                  {selectedEvent.availability.map((avail: any) => (
                    <Pressable
                      key={avail.id}
                      className="flex-row items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800"
                      onPress={() => avail.link && console.log('Open link:', avail.link)}
                    >
                      <Text className="font-medium">{avail.platform}</Text>
                      <Text className="text-blue-600 dark:text-blue-500">→</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Chiudi */}
            <Button 
              onPress={() => setSelectedEvent(null)}
              variant="outline"
            >
              Chiudi
            </Button>
          </View>
        )}
      </BottomSheet>
    </>
  );
};

export default ItemDetailScreen;
