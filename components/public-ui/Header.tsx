import { cn } from "@/lib/utils";

const Header = ({
  className,
  color = "pewter",
  children,
  level = 1,
}: {
  className?: string;
  color?: string;
  children: string;
  level?: 1 | 2 | 3 | 4 | 5;
}) => {
  return (
    <div
      className={cn(
        `w-full text-${color} text-center font-serif
            decoration-2 underline-offset-8 leading-tight
            ${
              level === 1 &&
              `
                text-left text-[36px]
                sm:text-[40px]
                md:text-center md:text-[48px]
                lg:text-[55px]
                underline
            `
            }
            ${level === 2 && "text-left md:text-center text-[32px] md:text-[36px]"}
            ${level === 3 && "text-[28px] md:text-[28px] underline-offset-4"}
            ${level === 4 && "text-[24px] md:text-[25px] decoration-1 underline-offset-4"}
            ${level === 5 && "text-[24px] md:text-[25px] decoration-1 underline-offset-4"}
            `,
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Header;
