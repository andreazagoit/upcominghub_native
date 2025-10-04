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
      <View style={[style, styles.placeholder]}>
        <Text style={styles.icon}>🖼️</Text>
      </View>
    );
  }

  // ExpoImage non supporta className, quindi lo convertiamo in style se necessario
  return (
    <ExpoImage
      source={{ uri }}
      style={style}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      onError={(error) => {
        console.log('Image error:', uri, error);
        setHasError(true);
      }}
      onLoad={() => console.log('Image loaded:', uri)}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 48,
    opacity: 0.3,
  },
});
