import React from "react";
import {View} from "react-native";
import {Text} from "./text";

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
}) => {
  return (
    <View className="px-5 pt-4 pb-6">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-3xl font-bold mb-1">{title}</Text>
          {description && (
            <Text variant="secondary" className="text-base">
              {description}
            </Text>
          )}
        </View>
        {actions && <View className="ml-4">{actions}</View>}
      </View>
    </View>
  );
};

