import Image, { StaticImageData } from "next/image"

const LargeCarouselItem = ({ title, description, image, color = "pewter" }: { title: string, description: string, image: StaticImageData, color?: string }) => {
    return (
        <div className="w-full flex items-center justify-center gap-6">
            <div className="w-[550px] h-[450px] aspect-square relative">
                <Image src={image} alt="Rescue 1" fill className="object-cover object-center" />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
                <div className={`text-[36px] font-serif text-${color}`}>
                    {title}
                </div>
                <div className="text-lg text-ink">
                    {description}
                </div>
            </div>
        </div>
    )
}

export default LargeCarouselItem;