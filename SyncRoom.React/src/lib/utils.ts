
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merges tailwind classes and handles conditional logic.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Safely generates initials from first and last names.
export function getInitials(firstName?: string, lastName?: string) {
  if (!firstName || !lastName) return '??';
  
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  
  return `${first}${last}`.toUpperCase();
}

// Splits a comma-seperated string of amenities into a clean array.
export function parseAmenities(amenities: string | null | undefined): string[] {
  if (!amenities) return [];
  return amenities.split(',').map((a) => a.trim()).filter(Boolean);
}
