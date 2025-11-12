import { GoDotFill } from "react-icons/go";

const List = ({ children }: { children: React.ReactNode[] }) => {
    return (
        <ul className="flex flex-col gap-2 text-left">
            {children.map((each, i) => {
                return (
                    <li key={i} className="flex gap-2">
                        <GoDotFill className="mt-1" />
                        <div>{each}</div>
                    </li>
                )
            })}
        </ul>
    )
}

export default List;