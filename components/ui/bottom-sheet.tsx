import React from "react";
import {BottomSheet as ExpoBottomSheet, Host} from "@expo/ui/swift-ui";
import {useWindowDimensions, View} from "react-native";

interface BottomSheetProps {
  /**
   * Stato di apertura del bottom sheet
   */
  isOpen: boolean;
  /**
   * Callback quando cambia lo stato
   */
  onOpenChange: (isOpen: boolean) => void;
  /**
   * Contenuto del bottom sheet
   */
  children: React.ReactNode;
}

/**
 * Componente BottomSheet nativo iOS
 * Usa @expo/ui per un'esperienza nativa
 * 
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Button onPress={() => setIsOpen(true)}>
 *   Apri Bottom Sheet
 * </Button>
 * 
 * <BottomSheet isOpen={isOpen} onOpenChange={setIsOpen}>
 *   <View className="p-5">
 *     <Text>Contenuto del bottom sheet</Text>
 *   </View>
 * </BottomSheet>
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onOpenChange,
  children,
}) => {
  const {width} = useWindowDimensions();

  return (
    <Host style={{position: "absolute", width}}>
      <ExpoBottomSheet
        isOpened={isOpen}
        onIsOpenedChange={(e) => onOpenChange(e)}
      >
        {children}
      </ExpoBottomSheet>
    </Host>
  );
};

