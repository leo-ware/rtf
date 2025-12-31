"use client"
import { DndProvider as ReactDndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

const DnDProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ReactDndProvider backend={HTML5Backend}>
            {children}
        </ReactDndProvider>
    )
}

export default DnDProvider