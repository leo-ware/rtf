import { StaticImageData } from "next/image"
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit"

const LargeCarouselItem = ({ title, description, image, color = "pewter", authorCredit }: { title: string, description: string, image: StaticImageData, color?: string, authorCredit?: string }) => {
    return (
        <div className="w-full h-full flex flex-col lg:flex-row items-center justify-start lg:justify-center gap-4 lg:gap-6">
            <ImageWithAuthorCredit
                src={image}
                alt="Rescue 1"
                fill
                className="object-cover object-center"
                wrapperClassName="w-full lg:w-[550px] h-[250px] lg:h-[450px] relative shrink-0"
                authorCredit={authorCredit}
            />
            <div className="w-full lg:w-1/2 flex flex-col gap-2 px-4 lg:px-0">
                <div className={`text-[24px] lg:text-[36px] font-serif text-${color}`}>
                    {title}
                </div>
                <div className="text-base lg:text-lg text-ink line-clamp-8 lg:line-clamp-10">
                    {description}
                </div>
            </div>
        </div>
    )
}

export default LargeCarouselItem;