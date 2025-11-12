import Hero from "@/components/public-ui/Hero"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import Button from "@/components/public-ui/Button"

import hero from "./hero.jpg"
import pamela from "./pamela.png"
import calico from "./calico-kids.png"
import car from "./car.png"


const OtherWaysToGivePage = () => {
    return (
        <div className="w-full h-fit flex flex-col gap-16 mb-12 items-center justify-start text-center">
            <Hero title="Other Ways to Give" image={hero} />

            <AlternatingPictureLayout items={[
                {
                    title: <div>Pamela's Pickles</div>,
                    description:[
                        <>
                            This is a staff-guided walking tour of the sanctuary with some time for
                            quiet herd observation along the way. Meet some of the mustangs who live
                            here and represent a vital link to the history of the horse in North America.
                            Learn about the horse as a native species with its origins in North America.
                            
                        </>,
                        <Button color="cinnamon" className="mt-4">Read More</Button>
                    ],
                    image: pamela,
                },
                {
                    title: <div>Donate a Car</div>,
                    description:[
                        <>
                            This is a staff-guided walking tour of the sanctuary with some time for
                            quiet herd observation along the way. Meet some of the mustangs who live
                            here and represent a vital link to the history of the horse in North America.
                            Learn about the horse as a native species with its origins in North America.
                            
                        </>,
                        <Button color="cinnamon" className="mt-4">Read More</Button>
                    ],
                    image: car,
                },
                {
                    title: <div>Calico Horses for Kids</div>,
                    description:
                        <>
                            This is a staff-guided walking tour of the sanctuary with some time for
                            quiet herd observation along the way. Meet some of the mustangs who live
                            here and represent a vital link to the history of the horse in North America.
                            Learn about the horse as a native species with its origins in North America.
                            <Button color="cinnamon" className="mt-4">Read More</Button>
                        </>,
                    image: calico,
                },
            ]} />
        </div>
    )
}

export default OtherWaysToGivePage