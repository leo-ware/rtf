import BlurredImageCard from "./public-ui/BlurredImageCard"
import GenericDonateDialogue from "./donation-widgets/GenericDonateDialogue"
import Button from "./public-ui/Button"

import BlurredBg from "./images/blurred-bg.jpg"

const WHDCallout = () => {
    return (
        <div className="w-11/12 md:w-10/12 mx-auto">
            <BlurredImageCard image={BlurredBg}>
                <div className="w-full h-full py-10 md:py-16 px-6 md:px-10 flex flex-col items-center justify-center gap-4">
                    <div className="text-[32px] md:text-[48px] font-serif text-white text-center leading-none">
                        Donate to <br /> Wild Horse Defense Fund
                    </div>
                    <div className="max-w-[650px] mt-2 text-base md:text-lg text-white text-center">
                        The Wild Horse Defense Fund fuels Return to Freedom's
                        frontline work to end cruel roundups, advance humane
                        on-range management, and defend wild horses through
                        advocacy, legal action, and education.
                    </div>
                    <GenericDonateDialogue defaultPathwayName="Wild Horse Defense Fund">
                        <Button color="cinnamon" className="mt-2">
                            Donate Now
                        </Button>
                    </GenericDonateDialogue>
                </div>
            </BlurredImageCard>
        </div>
    )
}

export default WHDCallout
