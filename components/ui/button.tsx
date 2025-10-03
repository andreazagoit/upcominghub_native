import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  style,
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getButtonStyles = () => {
    const baseStyles = {
      borderRadius: 8,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      flexDirection: "row" as const,
    };

    // Size styles
    const sizeStyles = {
      sm: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 32,
      },
      md: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 40,
      },
      lg: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        minHeight: 48,
      },
    };

    // Variant styles
    const variantStyles = {
      default: {
        backgroundColor: isDark ? "#3b82f6" : "#2563eb",
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: isDark ? "#374151" : "#f3f4f6",
        borderWidth: 0,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: isDark ? "#4b5563" : "#d1d5db",
      },
      ghost: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
      destructive: {
        backgroundColor: isDark ? "#dc2626" : "#ef4444",
        borderWidth: 0,
      },
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextColor = () => {
    switch (variant) {
      case "secondary":
        return isDark ? "#ffffff" : "#111827";
      case "outline":
        return isDark ? "#ffffff" : "#111827";
      case "ghost":
        return isDark ? "#ffffff" : "#111827";
      case "destructive":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return 14;
      case "md":
        return 16;
      case "lg":
        return 18;
      default:
        return 16;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        getButtonStyles(),
        isDisabled && {
          opacity: 0.5,
        },
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{marginRight: 8}}
        />
      )}
      <Text
        style={{
          color: getTextColor(),
          fontSize: getTextSize(),
          fontWeight: "600",
        }}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
