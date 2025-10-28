import Image, { StaticImageData } from "next/image"


const Hero = ({ title, image }: { title: string, image: StaticImageData }) => {
    return (
        <div
            className="
                w-full h-[50vh] xl:h-[80vh]
                relative flex items-center justify-center bg-sage-green"
            // style={{height: "calc(100vh - 140px)"}}
            >
            <Image
                src={image}
                alt="About Hero"
                className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center"
                fill
            />
            <div className="z-10 border-b border-white text-white text-[48px] md:text-[64px] font-serif">
                {title}
            </div>
        </div>
    )
}

export default Hero