import {View} from "react-native";
import {Text} from "@/components/ui/text";
import {PageHeader} from "@/components/ui/page-header";

export default function SearchScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-black">
      <PageHeader
        title="Cerca"
        description="Cerca items, collezioni, articoli ed eventi"
      />
      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-6xl mb-4">🔍</Text>
        <Text variant="heading" className="mb-2 text-center">
          Funzione in arrivo
        </Text>
        <Text variant="caption" className="text-center text-zinc-600 dark:text-zinc-400">
          La ricerca sarà presto disponibile
        </Text>
      </View>
    </View>
  );
}