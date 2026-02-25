import { StaticImageData } from "next/image"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"

const LargeCarouselItem = ({ title, description, image, color = "pewter", authorCredit }: { title: string, description: string, image: StaticImageData, color?: string, authorCredit?: string }) => {
    return (
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <ImageWithAuthorCredit
                src={image}
                alt="Rescue 1"
                fill
                className="object-cover object-center"
                wrapperClassName="w-full md:w-[550px] h-[250px] md:h-[450px] relative"
                authorCredit={authorCredit}
            />
            <div className="w-full md:w-1/2 flex flex-col gap-2 px-4 md:px-0">
                <div className={`text-[24px] md:text-[36px] font-serif text-${color}`}>
                    {title}
                </div>
                <div className="text-base md:text-lg text-ink">
                    {description}
                </div>
            </div>
        </div>
    )
}

export default LargeCarouselItem;