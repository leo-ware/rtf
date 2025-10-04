import { twMerge } from "tailwind-merge"

const Button = ({className, children, color = "pewter"}: {className?: string, children?: React.ReactNode, color: string}) => {
    return (
        <div className={twMerge(`
            rounded-xl border-1 w-fit flex items-center font-bold text-xs
            justify-center p-2 text-white text-sm bg-${color} border-${color}`,
            className)}
        >
            {children}
        </div>
    )
}

export default Button
