import Image from "next/image"
import isadora from "./isadora.jpg"
import Button from "@/components/public-ui/Button"

const GenericDonateDialogue = () => {
    return (
        <div className="w-full h-fit relative bg-sage-green rounded-md overflow-hidden
            flex items-center gap-8 text-milk text-left">
            <div className="w-1/2 h-fit flex flex-col gap-8 p-8">
                <div className="flex flex-col gap-2">
                    <div className="text-[48px] font-serif">Every Horse Needs a Hero</div>
                    <div className="uppercase font-semibold">Wild Horse Defense Fund</div>
                </div>

                <div className="w-1/2 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                            Yearly
                        </Button>
                        <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                            Monthly
                        </Button>
                        <Button color="milk" className="min-w-fit grow rounded-md text-ink text-xs px-4">
                            One-Time
                        </Button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                            $15,000
                        </Button>
                        <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                            $7,500
                        </Button>
                        <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                            $3,750
                        </Button>
                        <Button color="milk" className="grow rounded-md text-ink text-xs px-4">
                            $1,250
                        </Button>
                    </div>
                    <div className="w-full flex mt-2 flex-col gap-1 items-start">
                        <div className="text-lg uppercase font-semibold text-white">Other Amount</div>
                        <div className="w-full flex items-center justify-between">
                            <div className="flex w-36 h-8 bg-milk rounded-sm overflow-hidden">
                                <div className="h-full px-4 w-fit bg-cinnamon text-white flex items-center justify-center">
                                    $
                                </div>
                                <input type="number" className="h-full w-1/2 bg-transparent text-right" />
                            </div>
                            <Button color="cinnamon" className="h-8 flex items-center justify-center rounded-sm px-4">
                                Next
                            </Button>
                        </div>
                        <div className="text-lg text-white">
                            Donation includes: Certificate, Sanctuary Tour
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="text-2xl font-serif">Freedom Sponsor</div>
                    <div className="text-lg">
                        For only $8.22 a day, your Freedom Sponsorship provides full care and feed
                        for a rescued wild horse every month. Freedom Sponsors also receive a complimentary
                        photo safari /herd immersion or sanctuary tour for two annually!
                    </div>
                </div>
            </div>

            <div className="relative w-1/2 h-full min-h-[800px] bg-white">
                <Image src={isadora} alt="Isadora" fill className="object-cover object-center" />
            </div>
        </div>
    )
}

export default GenericDonateDialogue;