import Hero from "@/components/public-ui/Hero"
import CardLayout from "@/components/public-ui/CardLayout"
import { DonationWidgets } from "@/components/donation-widgets/DonationWidgets"

import HeroImg from "./donate_hero.jpg"

const DonatePage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start text-center">
            <Hero title="Donate" image={HeroImg} />

            <div className="w-full h-fit px-16 py-12 bg-sage-green">
                <div className="mx-auto w-11/12 md:w-10/12 text-white flex gap-16
                    flex-col items-center
                    md:flex-row md:justify-center">
                    <div className="basis-0 grow flex flex-col items-end justify-center md:text-right gap-4">
                        <div className="text-4xl font-serif">Donate to Return to Freedom</div>
                        <div className="text-lg">
                            Support the work that we do across our pillars. Your donation will help us protect
                            the future of America's wild horses and burros.
                        </div>
                    </div>
                    <div className="basis-0 grow">
                    </div>
                </div>
            </div>

            <div className="w-10/12 h-fit my-16">
                <CardLayout>
                    {Object.values(DonationWidgets).map((Widget, i) => (
                        <div key={i} className="w-full h-fit">
                            <Widget />
                        </div>
                    ))}
                </CardLayout>
            </div>
        </div>
    )
}

export default DonatePage