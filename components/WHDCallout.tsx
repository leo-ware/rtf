import DonationCallout from "./DonationCallout"
import WhdfImage from "@/app/(main)/(landing)/imgs/whdf.jpg"

const WHDCallout = () => {
    return (
        <div className="w-11/12 md:w-10/12 mx-auto">
            <DonationCallout
                image={WhdfImage}
                heading={<>Donate to <br /> Wild Horse Defense Fund</>}
                description="The Wild Horse Defense Fund fuels Return to Freedom's frontline work to end cruel roundups, advance humane on-range management, and defend wild horses through advocacy, legal action, and education."
                donatePathway="Wild Horse Defense Fund"
                buttonText="Donate Now"
                align="center"
                analyticsName="whd_fund"
            />
        </div>
    )
}

export default WHDCallout
