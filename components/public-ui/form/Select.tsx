"use client"

import { cn } from "@/lib/utils";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { useState, useRef } from "react";

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

    return (
        <div className={cn(
            "w-40 h-10 relative",
            props.containerClassName
        )}>
            <div
                className={`
                    absolute top-0 left-0 w-full min-h-10
                    flex flex-col items-center justify-between
                    border-2 border-pewter rounded-sm
                    bg-white
                `}
                ref={containerRef}
                tabIndex={0}
                onBlur={() => setOpen(false)}
            >

                <div
                    className="w-full h-10 py-1 px-2 flex items-center justify-between"
                    onClick={() => setOpen(!open)}
                >
                    <div className="uppercase text-sm font-semibold text-pewter">
                        {props.selectedValue === null
                            ? props.placeholder
                            : props.selectedValue.label
                        }
                    </div>

                    {open
                        ? (
                            <div className="w-fit h-fit">
                                <FaCaretUp size={16} className="text-pewter" />
                            </div>
                        ) : (
                            <div className="w-fit h-fit">
                                <FaCaretDown size={16} className="text-pewter" />
                            </div>
                        )
                    }
                </div>

                {open && (
                    <div className="w-10/12 h-px mx-auto border-t-2 border-pewter opacity-50" />
                )}

                {open && (
                    <div className="w-full h-fit flex flex-col my-2">
                        {props.options.map((option, i) => (
                            <div
                                key={`${option.label}-${i}`}
                                className={`
                                    w-full py-1 px-2
                                    cursor-pointer
                                    flex items-center justify-between
                                    text-pewter uppercase text-sm font-semibold
                                    hover:underline underline-offset-2 decoration-2 decoration-pewter
                                    ${props.selectedValue === option.value ? "text-semibold" : ""}
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
                )}
            </div>
        </div>
    )
}

export default Select;