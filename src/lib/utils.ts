import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export function readingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200)
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '…' : str
}
