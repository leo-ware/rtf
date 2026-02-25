import Image from "@tiptap/extension-image"
import { ReactNodeViewRenderer } from "@tiptap/react"
import CustomImageView from "./CustomImageView"

export const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            "data-image-id": {
                default: null,
                parseHTML: element => element.getAttribute("data-image-id"),
                renderHTML: attributes => {
                    if (!attributes["data-image-id"]) {
                        return {}
                    }
                    return {
                        "data-image-id": attributes["data-image-id"],
                    }
                },
            },
            // Persist width to HTML (from TipTap resize)
            width: {
                default: null,
                parseHTML: element => element.getAttribute("width"),
                renderHTML: attributes => {
                    if (!attributes.width) {
                        return {}
                    }
                    return { width: attributes.width }
                },
            },
            // Persist height to HTML (from TipTap resize)
            height: {
                default: null,
                parseHTML: element => element.getAttribute("height"),
                renderHTML: attributes => {
                    if (!attributes.height) {
                        return {}
                    }
                    return { height: attributes.height }
                },
            },
        }
    },
    addNodeView() {
        return ReactNodeViewRenderer(CustomImageView)
    },
})
