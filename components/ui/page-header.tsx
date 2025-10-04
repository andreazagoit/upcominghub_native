import React from "react";
import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Text} from "./text";
import {cn} from "@/lib/utils";

interface PageHeaderProps {
  /**
   * Titolo della pagina
   */
  title: string;
  /**
   * Sottotitolo/descrizione (opzionale)
   */
  description?: string;
  /**
   * Azioni personalizzate (es. bottoni) da mostrare a destra
   */
  actions?: React.ReactNode;
  /**
   * Classi Tailwind custom
   */
  className?: string;
}

/**
 * Header standard per le pagine dell'app
 * Fornisce un titolo, descrizione opzionale e spazio per azioni
 * 
 * @example
 * <PageHeader 
 *   title="Esplora" 
 *   description="Scopri le ultime novità"
 * />
 * 
 * @example
 * // Con azioni
 * <PageHeader 
 *   title="Collezioni" 
 *   description="Le tue collezioni preferite"
 *   actions={<Button>Aggiungi</Button>}
 * />
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className,
}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View className={cn("px-5 pt-4 pb-6", className)} style={{paddingTop: insets.top + 16}}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-3xl font-bold mb-1">{title}</Text>
          {description && (
            <Text className="text-base text-zinc-600 dark:text-zinc-400">
              {description}
            </Text>
          )}
        </View>
        {actions && <View className="ml-4">{actions}</View>}
      </View>
    </View>
  );
};

