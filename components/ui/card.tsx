import React from "react";
import {Pressable, PressableProps, StyleProp, View, ViewProps, ViewStyle} from "react-native";
import {cn} from "@/lib/utils";

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
  pressableProps?: Omit<PressableProps, "onPress" | "style" | "className">;
  /**
   * Variante della card
   */
  variant?: "default" | "outlined" | "flat";
  /**
   * Stile custom
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Classi Tailwind
   */
  className?: string;
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
  style,
  className,
  children,
  ...viewProps
}) => {
  // Variant classes
  const variantClasses = {
    default: "bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800",
    outlined: "bg-transparent border border-gray-200 dark:border-gray-700",
    flat: "bg-white dark:bg-zinc-950",
  };

  // Combine all classes using cn utility
  const cardClasses = cn("rounded-2xl", variantClasses[variant], className);

  if (pressable && onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={style}
        className={cardClasses}
        {...pressableProps}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={style} className={cardClasses} {...viewProps}>
      {children}
    </View>
  );
};

