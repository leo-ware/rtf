
import Image from "next/image"
import spiritImage from "./Spirit_by-Rich-Sladick.jpg"  
// import ParallaxBox from "@/components/ParallaxBox"

const SpiritSection = () => {
    return (
        <section className="relative py-16 bg-gray-900 text-white">
            {/* <ParallaxBox speed={1}>
                <Image src={spiritImage} alt="Spirit" className="w-full h-auto absolute top-0 left-0" />
            </ParallaxBox> */}
            
            {/* <div className="absolute top-0 left-0 w-full h-full max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-8">Spirit: Stallion of the Cimarron</h2>
                <p className="text-xl mb-8">
                    Meet the real Spirit who inspired the DreamWorks animated movie.
                </p>
                <Link href="/visit/meet-spirit" className="bg-red-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-red-700 transition-colors">
                    More about Spirit
                </Link>
            </div> */}
        </section>
    )
}

export default SpiritSection