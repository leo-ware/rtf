"use client";

import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { CustomImage } from "@/components/extensions/CustomImage";
import Youtube from "@tiptap/extension-youtube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/images/ImagePicker";
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Type,
    YoutubeIcon
} from "lucide-react";
import { useState } from "react";

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
    minimal?: boolean;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
    content,
    onChange,
    placeholder = "Start writing...",
    className = "",
    minimal = false
}) => {
    const [linkUrl, setLinkUrl] = useState("");
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

    const [youtubeURL, setYoutubeURL] = useState("");
    const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);

    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

    const extensions = [
        StarterKit.configure({
            codeBlock: false,
        }),
        Typography,
        Placeholder.configure({
            placeholder,
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: "text-blue-600 hover:text-blue-800 underline",
            },
        }),
        ...(minimal ? [] : [
            CustomImage.configure({
                HTMLAttributes: {},
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: "mx-auto",
                },
                inline: false,
                nocookie: true,
            })
        ])
    ]

    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: `prose prose-lg max-w-none focus:outline-none ${minimal ? "min-h-[150px]" : "min-h-[400px]"} p-4 ${className}`,
            },
        },
    });

    if (!editor) {
        return null;
    }

    const addLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
        }
        setLinkUrl("");
        setIsLinkDialogOpen(false);
    };

    const addYoutubeVideo = () => {
        if (youtubeURL) {
            editor.commands.setYoutubeVideo({ src: youtubeURL })
        }
        setYoutubeURL("");
        setIsYoutubeDialogOpen(false);
    };

    const handleImagePickerSelect = (imageData: { imageId: Id<"images">; url: string }) => {
        editor.chain().focus().setImage({
            src: imageData.url,
            "data-image-id": imageData.imageId,
        } as { src: string }).run();
        setIsImagePickerOpen(false);
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col max-h-[80vh]">
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-2 bg-gray-50 flex flex-wrap gap-1 flex-shrink-0">
                {/* Text Formatting */}
                <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive("bold") ? "bg-gray-200" : ""}
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive("italic") ? "bg-gray-200" : ""}
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                </div>

                {!minimal && (
                    <>
                        {/* Headings */}
                        <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().setParagraph().run()}
                                className={editor.isActive("paragraph") ? "bg-gray-200" : ""}
                            >
                                <Type className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}
                            >
                                <Heading1 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}
                            >
                                <Heading2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                className={editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}
                            >
                                <Heading3 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Lists */}
                        <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Button>
                        </div>
                    </>
                )}

                {/* Link */}
                <div className="flex items-center space-x-1 pr-2 border-r border-gray-300">
                    <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <LinkIcon className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Link</DialogTitle>
                                <DialogDescription>
                                    Enter the URL for the link
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="linkUrl">URL</Label>
                                    <Input
                                        id="linkUrl"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={addLink}>Add Link</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {!minimal && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsImagePickerOpen(true)}
                            >
                                <ImageIcon className="h-4 w-4" />
                            </Button>

                            <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <YoutubeIcon className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Add Youtube Video</DialogTitle>
                                        <DialogDescription>
                                            Enter the URL for the video
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="linkUrl">URL</Label>
                                            <Input
                                                id="linkUrl"
                                                value={youtubeURL}
                                                onChange={(e) => setYoutubeURL(e.target.value)}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" onClick={() => setIsYoutubeDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={addYoutubeVideo}>Add Video</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>

                {/* History */}
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-white prose overflow-y-auto flex-1 min-h-0">
                <EditorContent editor={editor} />
            </div>

            {/* Image Picker */}
            {!minimal && (
                <ImagePicker
                    isOpen={isImagePickerOpen}
                    onClose={() => setIsImagePickerOpen(false)}
                    onImageSelect={handleImagePickerSelect}
                />
            )}
        </div>
    );
};