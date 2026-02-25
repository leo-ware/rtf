import Hero from "@/components/public-ui/Hero"
import Header from "@/components/public-ui/Header"
import Callout from "@/components/public-ui/Callout"
import LearnTimelineContent from "./LearnTimelineContent"
import EducationResourcesWidget from "@/components/EducationResourcesWidget"

import HeroImg from "./learn-hero.jpg"

export const metadata = {
    title: "The Story of America's Wild Horses - Return to Freedom"
}

const LearnPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <Hero title="Learn" image={HeroImg} />
            <Callout>
                Understanding the past is the key to protecting the future. Dive into the history, science, and policy behind America's wild horses and burros — and discover why their preservation matters now more than ever.
            </Callout>
            <Header className="text-cinnamon">
                Timelines
            </Header>
            <p className="w-10/12 md:w-8/12 -mt-8 text-center text-lg md:text-xl text-ink">
                Explore the key moments and milestones that have shaped the history of wild horses and burros in America.
            </p>
            <LearnTimelineContent />
            <div className="w-10/12 mx-auto">
                <EducationResourcesWidget />
            </div>
        </div>
    )
}

export default LearnPage
