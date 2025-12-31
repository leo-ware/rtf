import { HTMLAttributes, DetailedHTMLProps, UIEventHandler } from 'react';

type ScrollDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    onScrollNearBottom: () => void;
    threshold?: number;
}

const ScrollDiv = ({
    children,
    onScrollNearBottom,
    threshold = 100,
    ...props
}: ScrollDivProps) => {
    const handleScroll: UIEventHandler<HTMLDivElement> = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollTop + clientHeight >= scrollHeight - threshold) {
            onScrollNearBottom?.();
        }
    };

    return (
        <div onScroll={handleScroll} {...props}>
            {children}
        </div>
    );
}

export default ScrollDiv;