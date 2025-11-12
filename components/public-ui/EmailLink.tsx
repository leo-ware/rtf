const EmailLink = ({ children }: { children: React.ReactNode }) => {
    return (
        <span className="text-cinnamon underline cursor-pointer px-1">
            {children}
        </span>
    )
}

export default EmailLink;