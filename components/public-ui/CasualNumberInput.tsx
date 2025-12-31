"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type CasualNumberInputProps = {
    value: number
    onChange: (value: number) => void
    onBlur?: () => void
    className?: string
    placeholder?: string
}

const CasualNumberInput = ({ value, onChange, onBlur, className, placeholder }: CasualNumberInputProps) => {
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
            type="number"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(parseInt(e.target.value))}
            onBlur={onBlur}
        />
    )
}

export default CasualNumberInput