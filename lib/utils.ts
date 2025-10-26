import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDay(createdAt: string) {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const displayText = diffDays === 0 ? "Today" : `${diffDays} days ago`;
    return displayText;
}