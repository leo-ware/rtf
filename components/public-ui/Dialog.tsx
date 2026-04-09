"use client"

import { useState, useContext, createContext } from "react"
import { IoMdClose } from "react-icons/io"
import { cn } from "@/lib/utils"

type DialogContextType = {
    open: boolean
    setOpen: (open: boolean) => void
    _inner_flag: boolean
}

const DialogContext = createContext<DialogContextType>({
    open: false,
    setOpen: () => { },
    _inner_flag: false
})

export const useDialogContext = () => (
    useContext(DialogContext)
)

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
    const { open, setOpen, _inner_flag } = useDialogContext()
    if (!_inner_flag) {
        throw new Error("DialogContent must be used within a Dialog")
    }
    return (
        open ? (
            <div
                className="fixed top-0 right-0 w-[100vw] h-[100vh] p-0 md:p-8 bg-black/50 z-50
                    flex items-center justify-center"
                onClick={() => setOpen(false)}>
                <div
                    className="relative w-full h-full md:w-fit md:h-fit md:max-w-[90vw] md:max-h-[90vh]
                        rounded-none md:rounded-md overflow-y-auto overflow-x-hidden scrollbar-thin"
                    onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        ) : null
    )
}

export const DialogClose = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
    const { setOpen, _inner_flag } = useDialogContext()
    if (!_inner_flag) {
        throw new Error("DialogClose must be used within a Dialog")
    }
    return (
        <div
            className={cn("cursor-pointer w-fit h-fit", className)}
            onClick={() => setOpen(false)}>
            {children || <IoMdClose />}
        </div>
    )
}

export const DialogTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const { setOpen, _inner_flag } = useDialogContext()
    if (!_inner_flag) {
        throw new Error("DialogTrigger must be used within a Dialog")
    }
    return (
        <div
            className={cn("cursor-pointer w-fit h-fit", className)}
            onClick={() => setOpen(true)}>
            {children}
        </div>
    )
}

export const Dialog = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const outerContext = useDialogContext()
    const [open, setOpen] = useState(false)

    if (outerContext._inner_flag) {
        throw new Error("Dialog cannot be nested")
    }

    return (
        <DialogContext.Provider value={{ open, setOpen, _inner_flag: true }}>
            <div className={cn("w-fit h-fit", className)}>
                {children}
            </div>
        </DialogContext.Provider>
    )
}