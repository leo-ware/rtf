"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type CasualTextInputProps = {
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    className?: string
    placeholder?: string
}

const CasualTextInput = ({ value, onChange, onBlur, className, placeholder }: CasualTextInputProps) => {
    return (
        <input
            className={cn(`
                relative
                w-24 h-6
            
                border-b-2 border-pewter/70
                
                bg-gradient-to-r from-pewter to-pewter
                bg-[length:0%_2px] bg-left-bottom bg-no-repeat
                bg-[position:0_calc(100%+2px)]
                
                focus:bg-[length:100%_2px]
                transition-[background-size] duration-200
            
                focus:outline-none focus:ring-0
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            `, className)}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
        />
    )
}

export default CasualTextInput