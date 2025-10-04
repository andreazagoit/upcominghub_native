import React from "react";
import {Text as RNText, TextProps as RNTextProps} from "react-native";
import {cn} from "@/lib/utils";

interface TextProps extends RNTextProps {
  /**
   * Variante predefinita del testo
   */
  variant?: "title" | "subtitle" | "body" | "caption" | "muted" | "secondary";
  /**
   * Se true, applica font-bold
   */
  bold?: boolean;
  /**
   * Classi Tailwind custom (hanno priorità sulle varianti)
   */
  className?: string;
}

/**
 * Componente Text con varianti predefinite e supporto Tailwind
 * 
 * @example
 * <Text>Testo normale</Text>
 * <Text variant="title" bold>Titolo in grassetto</Text>
 * <Text variant="muted">Testo grigio</Text>
 * <Text variant="secondary" className="text-lg">Override con className</Text>
 */
export const Text: React.FC<TextProps> = ({
  variant,
  bold,
  className,
  ...props
}) => {
  // Varianti predefinite
  const variantClasses = {
    title: "text-2xl",
    subtitle: "text-lg",
    body: "text-base",
    caption: "text-sm",
    muted: "text-zinc-500 dark:text-zinc-500",
    secondary: "text-zinc-600 dark:text-zinc-400",
  };

  return (
    <RNText
      className={cn(
        "text-black dark:text-white",
        variant && variantClasses[variant],
        bold && "font-bold",
        className
      )}
      {...props}
    />
  );
};
