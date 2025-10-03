import React from "react";
import {
  Image as RNImage,
  ImageProps as RNImageProps,
  ImageStyle,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text as RNText,
  View,
  ViewStyle,
} from "react-native";
import {useColorScheme} from "@/hooks/use-color-scheme";

interface CustomImageProps {
  /**
   * URI dell'immagine da mostrare
   */
  uri: string | null | undefined;
  /**
   * Callback quando l'immagine viene premuta
   */
  onPress?: () => void;
  /**
   * Stile custom per il container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Stile custom per l'immagine
   */
  imageStyle?: StyleProp<ImageStyle>;
  /**
   * Modalità di resize dell'immagine
   */
  resizeMode?: RNImageProps["resizeMode"];
  /**
   * Mostra un placeholder quando l'immagine non è disponibile
   */
  showPlaceholder?: boolean;
  /**
   * Testo o emoji per il placeholder
   */
  placeholderContent?: string;
  /**
   * Abilita/disabilita il press
   */
  disabled?: boolean;
  /**
   * Props aggiuntive per il Pressable
   */
  pressableProps?: Omit<PressableProps, "onPress" | "style" | "disabled">;
}

export const Image: React.FC<CustomImageProps> = ({
  uri,
  onPress,
  style,
  imageStyle,
  resizeMode = "cover",
  showPlaceholder = true,
  placeholderContent = "📷",
  disabled = false,
  pressableProps,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Se non c'è URI e non vogliamo placeholder, non mostrare nulla
  if (!uri && !showPlaceholder) {
    return null;
  }

  const content = uri ? (
    <RNImage
      source={{uri}}
      style={[imageStyle, styles.image]}
      resizeMode={resizeMode}
    />
  ) : (
    <View
      style={[
        imageStyle,
        styles.placeholder,
        {backgroundColor: isDark ? "#374151" : "#f3f4f6"},
      ]}
    >
      <Text style={styles.placeholderText}>{placeholderContent}</Text>
    </View>
  );

  // Se non c'è onPress o è disabled, mostra solo l'immagine
  if (!onPress || disabled) {
    return <View style={style}>{content}</View>;
  }

  // Altrimenti, rendi l'immagine cliccabile
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [style, pressed && styles.pressed]}
      {...pressableProps}
    >
      {content}
    </Pressable>
  );
};

const Text = ({children, style}: {children: string; style?: any}) => {
  return <RNText style={style}>{children}</RNText>;
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  placeholder: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
});
