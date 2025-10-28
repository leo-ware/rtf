import Hero from "@/components/public-ui/Hero"

import SpiritHero from "./spirit-hero.png"

const SpiritPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <Hero title="Spirit" image={SpiritHero} />
        </div>
    )
}

export default SpiritPage