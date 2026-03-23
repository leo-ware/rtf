"use client"

import { cn } from "@/lib/utils";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

export type SelectOption<T> = {
    label: string;
    value: T;
}

export type SelectProps<T> = {
    containerClassName?: string;
    placeholder?: string;
    options: SelectOption<T>[];
    selectedValue: SelectOption<T> | null;
    onSelect: (value: SelectOption<T> | null) => void;
}

const Select = <T,>(props: SelectProps<T>) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return
        const handleMouseDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleMouseDown)
        return () => document.removeEventListener("mousedown", handleMouseDown)
    }, [open])

    return (
        <div className={cn("w-40 h-10 relative", props.containerClassName)} ref={containerRef}>
            <div
                className="h-10 w-full border-2 border-pewter rounded-sm px-2 flex items-center justify-between cursor-pointer bg-white"
                onClick={() => setOpen(!open)}
            >
                <div className="uppercase text-sm font-semibold text-pewter">
                    {props.selectedValue === null
                        ? props.placeholder
                        : props.selectedValue.label
                    }
                </div>
                {open
                    ? <FaCaretUp size={16} className="text-pewter" />
                    : <FaCaretDown size={16} className="text-pewter" />
                }
            </div>

            {open && (
                <div className="absolute top-full left-0 w-full z-50 bg-white border-2 border-pewter rounded-sm mt-0.5">
                    <div className="w-full h-fit flex flex-col py-1">
                        {props.options.map((option, i) => (
                            <div
                                key={`${option.label}-${i}`}
                                className={`
                                    w-full py-1 px-2
                                    cursor-pointer
                                    flex items-center justify-between
                                    text-pewter uppercase text-sm font-semibold
                                    hover:underline underline-offset-2 decoration-2 decoration-pewter
                                `}
                                onClick={() => {
                                    props.onSelect(option)
                                    setOpen(false)
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Select;
