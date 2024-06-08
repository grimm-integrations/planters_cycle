/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string.
 * @param inputs - The class names to be combined.
 * @returns The combined class names as a string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a given date to a localized string representation.
 * If the date is not provided or is null, an empty string is returned.
 * @param date - The date to format.
 * @param locale - The locale to use for formatting. Defaults to 'de-DE'.
 * @returns The formatted date string.
 */
export const formatDateToLocal = (date?: Date | null, locale = 'de-DE') => {
  if (!date || date == undefined) return '';
  date = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
