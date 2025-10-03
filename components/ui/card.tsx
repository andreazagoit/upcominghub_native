import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import {useColorScheme} from "@/hooks/use-color-scheme";

interface CardProps extends ViewProps {
  /**
   * Se true, la card è cliccabile
   */
  pressable?: boolean;
  /**
   * Callback quando la card viene premuta (richiede pressable=true)
   */
  onPress?: () => void;
  /**
   * Props aggiuntive per il Pressable
   */
  pressableProps?: Omit<PressableProps, "onPress" | "style">;
  /**
   * Variante della card
   */
  variant?: "default" | "outlined" | "flat";
  /**
   * Disabilita shadows ed elevation
   */
  noShadow?: boolean;
  /**
   * Stile custom
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Contenuto della card
   */
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  pressable = false,
  onPress,
  pressableProps,
  variant = "default",
  noShadow = false,
  style,
  children,
  ...viewProps
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getCardStyles = () => {
    const baseStyles = [
      styles.card,
      !noShadow && styles.shadow,
    ];

    const variantStyles = {
      default: {
        backgroundColor: isDark ? "#09090b" : "#ffffff",
        borderWidth: 1,
        borderColor: isDark ? "#27272a" : "#e5e7eb",
      },
      outlined: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#e5e7eb",
      },
      flat: {
        backgroundColor: isDark ? "#09090b" : "#ffffff",
        borderWidth: 0,
      },
    };

    return [...baseStyles, variantStyles[variant], style];
  };

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({pressed}) => [
          ...getCardStyles(),
          pressed && styles.pressed,
        ]}
        {...pressableProps}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={getCardStyles()} {...viewProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pressed: {
    opacity: 0.8,
  },
});

