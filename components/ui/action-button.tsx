import React from "react";
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import {Text} from "@/components/ui/text";
import {useColorScheme} from "@/hooks/use-color-scheme";
import {Ionicons} from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

interface ActionButtonProps {
  /**
   * Nome dell'icona di Ionicons
   */
  icon: IconName;
  /**
   * Stato attivo del bottone
   */
  isActive?: boolean;
  /**
   * Stato di caricamento
   */
  isLoading?: boolean;
  /**
   * Callback al click
   */
  onPress?: () => void;
  /**
   * Bottone disabilitato
   */
  disabled?: boolean;
  /**
   * Dimensione del bottone
   */
  size?: "sm" | "default" | "lg";
  /**
   * Variante del bottone
   */
  variant?: "default" | "outline" | "ghost";
  /**
   * Colore quando attivo
   */
  activeColor?: "red" | "blue" | "green" | "purple" | "orange";
  /**
   * Variante del colore attivo
   */
  activeVariant?: "filled" | "outlined" | "subtle";
  /**
   * Testo opzionale accanto all'icona
   */
  children?: string;
  /**
   * Stile custom
   */
  style?: StyleProp<ViewStyle>;
}

const colorSchemes = {
  red: {
    filled: {bg: "#ef4444", border: "#ef4444", text: "#ffffff"},
    outlined: {bg: "transparent", border: "#ef4444", text: "#ef4444"},
    subtle: {
      light: {bg: "#fef2f2", border: "#fecaca", text: "#dc2626"},
      dark: {bg: "rgba(220, 38, 38, 0.1)", border: "#991b1b", text: "#f87171"},
    },
  },
  blue: {
    filled: {bg: "#3b82f6", border: "#3b82f6", text: "#ffffff"},
    outlined: {bg: "transparent", border: "#3b82f6", text: "#3b82f6"},
    subtle: {
      light: {bg: "#eff6ff", border: "#bfdbfe", text: "#2563eb"},
      dark: {bg: "rgba(37, 99, 235, 0.1)", border: "#1e40af", text: "#60a5fa"},
    },
  },
  green: {
    filled: {bg: "#10b981", border: "#10b981", text: "#ffffff"},
    outlined: {bg: "transparent", border: "#10b981", text: "#10b981"},
    subtle: {
      light: {bg: "#f0fdf4", border: "#bbf7d0", text: "#059669"},
      dark: {bg: "rgba(5, 150, 105, 0.1)", border: "#065f46", text: "#34d399"},
    },
  },
  purple: {
    filled: {bg: "#a855f7", border: "#a855f7", text: "#ffffff"},
    outlined: {bg: "transparent", border: "#a855f7", text: "#a855f7"},
    subtle: {
      light: {bg: "#faf5ff", border: "#e9d5ff", text: "#9333ea"},
      dark: {bg: "rgba(147, 51, 234, 0.1)", border: "#6b21a8", text: "#c084fc"},
    },
  },
  orange: {
    filled: {bg: "#f97316", border: "#f97316", text: "#ffffff"},
    outlined: {bg: "transparent", border: "#f97316", text: "#f97316"},
    subtle: {
      light: {bg: "#fff7ed", border: "#fed7aa", text: "#ea580c"},
      dark: {bg: "rgba(234, 88, 12, 0.1)", border: "#9a3412", text: "#fb923c"},
    },
  },
};

export function ActionButton({
  icon,
  isActive = false,
  isLoading = false,
  onPress,
  disabled = false,
  size = "default",
  variant = "outline",
  activeColor = "red",
  activeVariant = "filled",
  children,
  style,
}: ActionButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Dimensioni
  const buttonSize = size === "sm" ? 32 : size === "lg" ? 48 : 40;
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

  // Colori
  const getColors = () => {
    if (!isActive || isLoading) {
      // Stato inattivo
      if (variant === "outline") {
        return {
          bg: "transparent",
          border: isDark ? "#374151" : "#e5e7eb",
          text: isDark ? "#9ca3af" : "#6b7280",
        };
      }
      if (variant === "ghost") {
        return {
          bg: "transparent",
          border: "transparent",
          text: isDark ? "#9ca3af" : "#6b7280",
        };
      }
      return {
        bg: isDark ? "#374151" : "#f3f4f6",
        border: isDark ? "#374151" : "#f3f4f6",
        text: isDark ? "#ffffff" : "#111827",
      };
    }

    // Stato attivo
    const colors = colorSchemes[activeColor];
    if (activeVariant === "filled") {
      return colors.filled;
    }
    if (activeVariant === "outlined") {
      return colors.outlined;
    }
    // subtle
    return isDark ? colors.subtle.dark : colors.subtle.light;
  };

  const colors = getColors();

  const handlePress = () => {
    if (!disabled && !isLoading && onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading}
      style={({pressed}) => [
        styles.button,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: variant === "ghost" ? 0 : 1,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          transform: pressed ? [{scale: 0.95}] : [{scale: 1}],
        },
        children
          ? {
              paddingHorizontal: 16,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            }
          : {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <Ionicons name={icon} size={iconSize} color={colors.text} />
      )}
      {children && !isLoading && (
        <Text
          style={[
            styles.text,
            {
              color: colors.text,
              fontSize: size === "sm" ? 12 : size === "lg" ? 16 : 14,
            },
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontWeight: "600",
  },
});
