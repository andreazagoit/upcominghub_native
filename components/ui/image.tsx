import React from "react";
import { StyleProp, StyleSheet, Text, View } from "react-native";
import { Image as ExpoImage, ImageStyle } from "expo-image";

interface CustomImageProps {
  /**
   * URI dell'immagine da mostrare
   */
  uri: string | null | undefined;
  /**
   * Stile custom per l'immagine
   */
  style?: StyleProp<ImageStyle>;
}

export const Image: React.FC<CustomImageProps> = ({ uri, style }) => {
  const [hasError, setHasError] = React.useState(false);

  // Reset error quando cambia URI
  React.useEffect(() => {
    setHasError(false);
  }, [uri]);

  // Se non c'è URI o c'è stato un errore, mostra placeholder
  if (!uri || hasError) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.icon}>🖼️</Text>
      </View>
    );
  }

  return (
    <ExpoImage
      source={{ uri }}
      style={[styles.placeholder, style]}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      onError={() => setHasError(true)}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 48,
    opacity: 0.3,
  },
});
