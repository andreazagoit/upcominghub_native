import React from "react";
import {ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps} from "react-native";
import {cn} from "@/lib/utils";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Componente Button con Tailwind
 * 
 * @example
 * <Button>Click me</Button>
 * <Button variant="outline" size="sm">Small outline</Button>
 * <Button loading>Loading...</Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: "bg-blue-600 dark:bg-blue-600",
    secondary: "bg-gray-700 dark:bg-gray-700",
    outline: "bg-transparent border border-gray-300 dark:border-gray-600",
    ghost: "bg-transparent",
    destructive: "bg-red-600 dark:bg-red-600",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-2 min-h-[32px]",
    md: "px-4 py-3 min-h-[40px]",
    lg: "px-5 py-4 min-h-[48px]",
  };

  // Text color classes based on variant
  const textColorClasses = {
    default: "text-white",
    secondary: "text-white",
    outline: "text-gray-900 dark:text-gray-100",
    ghost: "text-gray-900 dark:text-gray-100",
    destructive: "text-white",
  };

  // Text size classes
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const buttonClasses = cn(
    "rounded-lg items-center justify-center flex-row",
    variantClasses[variant],
    sizeClasses[size],
    (disabled || loading) && "opacity-50",
    className
  );

  return (
    <TouchableOpacity
      className={buttonClasses}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text className={cn("font-semibold", textColorClasses[variant], textSizeClasses[size])}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};
