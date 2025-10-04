import React from "react";
import {Host, Picker} from "@expo/ui/swift-ui";

interface SegmentedTabsProps {
  /**
   * Array di opzioni per le tabs
   */
  options: string[];
  /**
   * Indice della tab selezionata
   */
  selectedIndex: number;
  /**
   * Callback quando cambia la tab
   */
  onTabChange: (index: number) => void;
  /**
   * Variante del picker (default: "segmented")
   */
  variant?: "segmented" | "menu";
}

/**
 * Componente SegmentedTabs con segmented picker nativo iOS
 * Usa @expo/ui per un'esperienza nativa
 * 
 * @example
 * const [activeTab, setActiveTab] = useState(0);
 * 
 * <SegmentedTabs
 *   options={['Eventi', 'Profilo']}
 *   selectedIndex={activeTab}
 *   onTabChange={setActiveTab}
 * />
 */
export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  options,
  selectedIndex,
  onTabChange,
  variant = "segmented",
}) => {
  return (
    <Host matchContents>
      <Picker
        options={options}
        selectedIndex={selectedIndex}
        onOptionSelected={({nativeEvent: {index}}) => {
          onTabChange(index);
        }}
        variant={variant}
      />
    </Host>
  );
};

