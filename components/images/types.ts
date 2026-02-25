import { Id } from "@/convex/_generated/dataModel";

export type ResolvedImageType = {
    url: string | null;
    _id: Id<"images">;
    _creationTime: number;
    altText?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
    authorCredit?: string | undefined;
    authors?: Id<"people">[] | undefined;
    authorNames?: string[] | undefined;
    title: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    size: number;
    storageId: Id<"_storage">;
}
