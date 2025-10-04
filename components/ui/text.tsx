import React from "react";
import {Text as RNText, TextProps as RNTextProps} from "react-native";
import {cn} from "@/lib/utils";

interface TextProps extends RNTextProps {
  /**
   * Variante tipografica (dimensione + peso)
   * Per i colori usa className="text-zinc-500" etc.
   */
  variant?: 
    | "display"         // 3xl bold - Titoli molto grandi
    | "title"           // 2xl semibold - Titoli di sezione
    | "subtitle"        // xl semibold - Sottotitoli
    | "heading"         // lg semibold - Intestazioni
    | "body"            // base - Testo normale (DEFAULT)
    | "label"           // base semibold - Link, label bold
    | "caption";        // sm - Didascalie, badge
  /**
   * Classi Tailwind (colori, spacing, etc.)
   */
  className?: string;
}

/**
 * Componente Text con varianti generiche
 * 
 * @example
 * <Text>Testo normale</Text>
 * <Text variant="large">Titolo grande</Text>  // 3xl bold
 * <Text variant="title">Titolo</Text>  // 2xl semibold
 * <Text variant="heading">Intestazione</Text>  // xl semibold
 * <Text variant="subheading">Sottotitolo</Text>  // lg semibold
 * <Text variant="small">Testo piccolo</Text>  // sm
 * <Text variant="muted">Info aggiuntiva</Text>  // grigio
 */
export const Text: React.FC<TextProps> = ({
  variant = "body", // Default: testo normale
  className,
  ...props
}) => {
  // Varianti: solo dimensione + peso
  const variantClasses = {
    display: "text-3xl font-bold",      // Molto grande
    title: "text-2xl font-semibold",    // Titoli sezione
    subtitle: "text-xl font-semibold",  // Sottotitoli
    heading: "text-lg font-semibold",   // Intestazioni
    body: "text-base",                  // Testo normale (DEFAULT)
    label: "text-base font-semibold",   // Link, label bold
    caption: "text-sm",                 // Didascalie, badge
  };

  return (
    <RNText
      className={cn(
        "text-black dark:text-white",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};
