import { cn } from "@/lib/utils";

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    containerClassName?: string;
    icon?: React.ReactNode;
}

const Input = (props: InputProps) => (
    <div className={cn(
        `h-10 border-2 border-pewter rounded-sm px-2 py-1
        flex items-center gap-2
        `,
        props.containerClassName
    )}>
        <input
            {...props}
            className={cn(`
                grow h-full border-none outline-none
                text-pewter text-sm
                focus-visible:ring-0 focus-visible:ring-offset-0
                selection:bg-pewter selection:text-white
                placeholder:text-pewter placeholder:uppercase placeholder:text-sm placeholder:font-semibold
                `,
                props.className
            )}
        />
        {props.icon && (
            <div className="shrink-0 aspect-square text-pewter">
                {props.icon}
            </div>
        )}
    </div>
)

export default Input;