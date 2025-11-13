import Image, { StaticImageData } from "next/image"
import { cn } from "@/lib/utils"

const TakeActionLink = ({ title, image, className }: { title: string, image: StaticImageData, className?: string }) => {
    return (
        <div className={cn("w-[350px] h-[400px] bg-seashell", className)}>
            <div className="relative w-full h-8/12">
                <Image src={image} alt={title} className="w-full h-full object-cover object-center" />
            </div>
            <div className="px-6 py-2 w-full h-4/12 flex items-center justify-center">
                <div className="text-2xl font-serif text-pewter text-center">
                    {title}
                </div>
            </div>
        </div>
    )
}

export default TakeActionLink