import { Doc } from "@/convex/_generated/dataModel";

export type PageProps<
    P extends Record<string, string | string[]> = Record<string, never>,
    S extends Record<string, string | string[]> = Record<string, never>
> = {
    params: Promise<P>;
    searchParams: Promise<S>;
};

export type ResolvedImageType = Doc<"images"> & {
    url: string | null;
}