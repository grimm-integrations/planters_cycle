/*
 * Copyright (c) Johannes Grimm 2024.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateToLocal = (date?: Date | null, locale = 'en-US') => {
  if (!date || date == undefined) return '';
  date = new Date(date.toLocaleString());
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};
