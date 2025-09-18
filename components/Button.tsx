import { twMerge } from "tailwind-merge"

const Button = ({className, children}: {className: string, children: React.ReactNode}) => {
    return (
        <div className={twMerge("px-3 py-2 bg-amber-500", className)}>
            {children}
        </div>
    )
}

export default Button
