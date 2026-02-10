import { ReactNode } from "react"

export const metadata = {
    title: "Program - Return to Freedom"
}

type LayoutProps = {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return <>{children}</>
}

export default Layout
