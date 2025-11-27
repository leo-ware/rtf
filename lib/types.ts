export type PageProps<
    P extends Record<string, string | string[]> = Record<string, never>,
    S extends Record<string, string | string[]> = Record<string, never>
> = {
    params: Promise<P>;
    searchParams: Promise<S>;
};

