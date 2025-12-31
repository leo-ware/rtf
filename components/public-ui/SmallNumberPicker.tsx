"use client"

import { useEffect, useState } from "react"
import { FaMinus, FaPlus } from "react-icons/fa"

type SmallNumberPickerProps = {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
}

const SmallNumberPicker = ({ value, onChange, min = 0, max = 99 }: SmallNumberPickerProps) => {

    const [localValue, setLocalValue] = useState<number | undefined>(value)

    const setValue = (value: number) => {
        const targetValue = Math.min(Math.max(value, min), max)
        setLocalValue(targetValue)
        onChange(targetValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const parsedValue = parseInt(value)
        if (isNaN(parsedValue)) {
            setLocalValue(undefined)
        } else {
            setValue(parsedValue)
        }
    }

    useEffect(() => {
        if (value !== localValue) {
            setLocalValue(value)
        }
    }, [value])

    return (
        <div className={`
            w-fit h-6
            border border-cinnamon rounded-full
            flex items-center justify-center
        `}>
            <div className="w-fit aspect-square p-1 text-cinnamon">
                <button onClick={() => setValue((localValue ?? value) - 1)}>
                    <FaMinus size={12} />
                </button>
            </div>

            <div
                className={`
                    h-full w-fit min-w-8 py-1 px-1
                    flex items-center justify-center
                    text-pewter text-lg font-semibold
                    border-x border-cinnamon
                `}
                >
                <input
                    className={`
                        focus:outline-none focus:ring-0
                        w-8
                        text-center text-md font-semibold
                    `}
                    value={localValue}
                    onBlur={() => {
                        if (localValue === undefined) {
                            setValue(0)
                        }
                    }}
                    onChange={handleInputChange} />
            </div>
            
            <div className="w-fit aspect-square p-1 text-cinnamon">
                <button onClick={() => setValue((localValue ?? value) + 1)}>
                    <FaPlus size={12} />
                </button>
            </div>
        </div>
    )
}

export default SmallNumberPicker