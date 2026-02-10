import { ReactNode } from "react"

export const metadata = {
    title: "Learn - Return to Freedom"
}

type LayoutProps = {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return <>{children}</>
}

export default Layout
