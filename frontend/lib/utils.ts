import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formattedNumber(num: number): string {
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "m";
  } else if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.?0+$/, "") + "k";
  } else {
    return num.toString();
  }
}

export function hexToString(hex: string): string {
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    // Convert each pair of hex characters (one byte) into a decimal number
    const hexByte = hex.substring(i, 2 + i);
    const charCode = parseInt(hexByte, 16); // Convert hex to decimal
    result += String.fromCharCode(charCode); // Convert decimal to character
  }
  return result;
}
export function hexToNumberArray(hex: string): number[] {
  const result: number[] = [];

  for (let i = 0; i < hex.length; i += 2) {
    const hexByte = hex.substring(i, i + 2);
    const num = parseInt(hexByte, 16); // Convert hex to decimal
    result.push(num);
  }

  return result;
}

export const availableCatgegories = [
  "Technology",
  "Health & Fitness",
  "Travel",
  "Fashion",
  "Music",
  "Food & Drink",
  "Gaming",
  "Movies & TV Shows",
  "Business & Finance",
  "Sports",
  "Art & Design",
  "Photography",
  "Books & Literature",
  "Science",
  "Personal Development",
  "Politics",
  "Education",
  "Lifestyle",
  "Entrepreneurship",
  "Environment",
];
