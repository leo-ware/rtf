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

type RemoveUndefinedFields<T> = {
    [K in keyof T as undefined extends T[K]
    ? T[K] extends undefined
    ? never
    : K
    : K
    ]: T[K]
}

export const removeUndefinedFields = <T extends Record<string, any>>(
    obj: T
): RemoveUndefinedFields<T> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as RemoveUndefinedFields<T>
}
