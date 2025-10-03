import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { forwardRef } from "react";
import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    Text,
    View,
} from "react-native";

interface TextInputProps extends RNTextInputProps {
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      style,
      variant = "default",
      size = "md",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const getContainerStyles = () => {
      const baseStyles = {
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: "row" as const,
        alignItems: "center" as const,
      };

      // Size styles
      const sizeStyles = {
        sm: {
          paddingHorizontal: 12,
          paddingVertical: 8,
          minHeight: 36,
        },
        md: {
          paddingHorizontal: 16,
          paddingVertical: 12,
          minHeight: 44,
        },
        lg: {
          paddingHorizontal: 20,
          paddingVertical: 16,
          minHeight: 52,
        },
      };

      // Variant styles
      const variantStyles = {
        default: {
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          borderColor: error
            ? isDark
              ? "#ef4444"
              : "#dc2626"
            : isDark
              ? "#374151"
              : "#d1d5db",
        },
        outline: {
          backgroundColor: "transparent",
          borderColor: error
            ? isDark
              ? "#ef4444"
              : "#dc2626"
            : isDark
              ? "#4b5563"
              : "#6b7280",
        },
        filled: {
          backgroundColor: isDark ? "#374151" : "#f9fafb",
          borderColor: error ? (isDark ? "#ef4444" : "#dc2626") : "transparent",
        },
      };

      return {
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      };
    };

    const getTextInputStyles = () => {
      const baseStyles = {
        flex: 1,
        color: isDark ? "#ffffff" : "#111827",
        fontSize: size === "sm" ? 14 : size === "lg" ? 18 : 16,
      };

      return baseStyles;
    };

    const getLabelColor = () => {
      if (error) {
        return isDark ? "#ef4444" : "#dc2626";
      }
      return isDark ? "#d1d5db" : "#6b7280";
    };

    const getHelperTextColor = () => {
      if (error) {
        return isDark ? "#ef4444" : "#dc2626";
      }
      return isDark ? "#9ca3af" : "#6b7280";
    };

    return (
      <View style={style}>
        {label && (
          <Text
            style={{
              color: getLabelColor(),
              fontSize: 14,
              fontWeight: "500",
              marginBottom: 6,
            }}
          >
            {label}
          </Text>
        )}
        <View style={getContainerStyles()}>
          {leftIcon && (
            <View style={{marginRight: 8, alignItems: "center"}}>
              {leftIcon}
            </View>
          )}
          <RNTextInput
            ref={ref}
            style={getTextInputStyles()}
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            {...props}
          />
          {rightIcon && (
            <View style={{marginLeft: 8, alignItems: "center"}}>
              {rightIcon}
            </View>
          )}
        </View>
        {(error || helperText) && (
          <Text
            style={{
              color: getHelperTextColor(),
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = "TextInput";
