import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

/**
 * Utility per combinare classi Tailwind
 * Gestisce conflitti e merge intelligente delle classi
 * 
 * @example
 * cn("text-lg font-bold", "text-red-500")
 * // → "text-lg font-bold text-red-500"
 * 
 * cn("text-lg text-gray-500", "text-red-500")
 * // → "text-lg text-red-500" (text-gray-500 viene sovrascritto)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

