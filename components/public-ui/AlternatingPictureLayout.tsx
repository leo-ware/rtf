import { StaticImageData } from "next/image"
import Image from "next/image"

type AlternatingPictureLayoutProps = {
    items: {
        title: React.ReactNode
        description: React.ReactNode
        image: StaticImageData
    }[]
}

const AlternatingPictureLayout = ({ items }: AlternatingPictureLayoutProps) => {
    return (
        <div className="w-full md:w-10/12 mx-auto h-fit flex flex-col gap-16">
            {items.map((item, index) => {
                const odd = index % 2 === 0
                return (
                    <div
                        key={`${item.title}-${index}`}
                        className={`
                            w-full h-fit flex flex-col gap-8 items-center justify-center
                            ${odd ? "md:flex-row-reverse" : "md:flex-row"}
                        `}>
                        <div className={`
                            md:w-1/2 flex flex-col gap-4 text-center
                            px-8 md:px-0
                            ${odd ? "md:text-left md:items-start" : "md:text-right md:items-end"}`}>
                            <div className="text-3xl font-serif text-sage-green">{item.title}</div>
                            <div className={`text-lg flex flex-col gap-4 items-center justify-center ${odd ? "md:items-start" : "md:items-end"}`}>
                                {item.description}
                            </div>
                        </div>
                        <div className="w-full max-h-[80vh] md:w-1/2 aspect-[5/3] relative">
                            <Image
                                src={item.image}
                                alt={"Alternate Picture Layout Image"}
                                className="w-full h-full object-cover object-center" />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default AlternatingPictureLayout