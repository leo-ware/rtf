import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const chunk = (array: any[], size: number) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
        array.slice(index * size, (index + 1) * size)
    )
}

export const range = (start: number, stop: number, step: number = 1): number[] => {
    const acc = []
    let i = start
    while (i < stop) {
        acc.push(i)
        i += step
    }
    return acc
}
