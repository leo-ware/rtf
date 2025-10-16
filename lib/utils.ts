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

export const indexArray = <T>(array: T[], keyFn: (item: T) => string) => {
    const map = new Map<string, T[]>()
    array.forEach(item => {
        const key = keyFn(item)
        map.set(key, [...(map.get(key) || []), item])
    })
    return map
}

export const indexArrayUnique = <T>(array: T[], keyFn: (item: T) => string) => {
    const map = new Map<string, T>()
    array.forEach(item => {
        const key = keyFn(item)
        map.set(key, item)
    })
    return map
}

export const multipleIndexArray = <T>(array: T[], keyFn: (item: T) => string[]) => {
    const map = new Map<string, T[]>()
    array.forEach(item => {
        const keys = keyFn(item)
        keys.forEach(key => {
            map.set(key, [...(map.get(key) || []), item])
        })
    })
    return map
}

export const dedupArray = <T>(array: T[], keyFn: (item: T) => string | number) => {
    const acc = new Set<string | number>()
    const res: T[] = []
    array.forEach(item => {
        const key = keyFn(item)
        if (!acc.has(key)) {
            acc.add(key)
            res.push(item)
        }
    })
    return res
}

export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
    return keys.reduce((acc, key) => {
        acc[key] = obj[key]
        return acc
    }, {} as Pick<T, K>)
}

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
    const entries = Object
        .entries(obj as Record<string, unknown>)
        .filter(([key]) => !keys.includes(key as K))
    return Object.fromEntries(entries) as Omit<T, K>
}

type RemoveUndefinedFields<T> = {
    [K in keyof T as undefined extends T[K]
    ? T[K] extends undefined
    ? never
    : K
    : K
    ]: T[K]
}

export const removeUndefined = <T extends Record<string, any>>(
    obj: T
): RemoveUndefinedFields<T> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as RemoveUndefinedFields<T>
}
