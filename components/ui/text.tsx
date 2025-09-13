import {useColorScheme} from "@/hooks/use-color-scheme";
import React from "react";
import {Text as RNText, TextProps as RNTextProps} from "react-native";

interface TextProps extends RNTextProps {
  variant?: "default" | "secondary" | "muted" | "accent";
}

export const Text: React.FC<TextProps> = ({
  style,
  variant = "default",
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getTextColor = () => {
    switch (variant) {
      case "secondary":
        return isDark ? "#a1a1aa" : "#71717a";
      case "muted":
        return isDark ? "#71717a" : "#a1a1aa";
      case "accent":
        return isDark ? "#3b82f6" : "#2563eb";
      default:
        return isDark ? "#ffffff" : "#000000";
    }
  };

  return (
    <RNText
      style={[
        {
          color: getTextColor(),
        },
        style,
      ]}
      {...props}
    />
  );
};
