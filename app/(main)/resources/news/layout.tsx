import { ReactNode } from "react"

export const metadata = {
    title: "News - Return to Freedom"
}

type NewsLayoutProps = {
    children: ReactNode
}

const NewsLayout = ({ children }: NewsLayoutProps) => {
    return children
}

export default NewsLayout
