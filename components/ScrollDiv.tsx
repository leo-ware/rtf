import { forwardRef, HTMLAttributes, DetailedHTMLProps, UIEventHandler } from 'react';

type ScrollDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    onScrollNearBottom: () => void;
    threshold?: number;
}

const ScrollDiv = forwardRef<HTMLDivElement, ScrollDivProps>(({
    children,
    onScrollNearBottom,
    onScroll,
    threshold = 100,
    ...props
}, ref) => {
    const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollTop + clientHeight >= scrollHeight - threshold) {
            onScrollNearBottom?.();
        }

        onScroll?.(e);
    };

    return (
        <div ref={ref} onScroll={handleScroll} {...props}>
            {children}
        </div>
    );
})

ScrollDiv.displayName = "ScrollDiv";

export default ScrollDiv;
