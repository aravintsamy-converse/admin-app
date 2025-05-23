import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const transformJobData = (
  dataArray: { jobType: string; value?: number | null; unit?: string | null }[]
) => {
  return dataArray.map((data) => {
    if (['Contract', 'Internship'].includes(data.jobType)) {
      return {
        ...data,
        value: data.value ?? 1,
        unit: data.unit ?? 'months',
      }
    }
    return {
      ...data,
      value: null,
      unit: null,
    }
  })
}
