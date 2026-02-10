import Hero from "@/components/public-ui/Hero"
import Header from "@/components/public-ui/Header"
import AlternatingPictureLayout from "@/components/public-ui/AlternatingPictureLayout"
import Image from "next/image"

import HeroImg from "./learn-hero.jpg"

export const metadata = {
    title: "The Story of America's Wild Horses - Return to Freedom"
}
import LearnImg1 from "./learn-timeline-1.png"
import LearnImg2 from "./learn-timeline-2.png"
import LearnImg3 from "./learn-timeline-3.png"
import LearnImg4 from "./learn-timeline-4.png"
import LearnImg5 from "./learn-timeline-5.png"
import LearnImg6 from "./learn-timeline-6.jpg"
import LearnImg7 from "./learn-timeline-7.png"
import LearnImg8 from "./learn-timeline-8.png"
import LearnImg9 from "./learn-timeline-9.png"
import LearnImg10 from "./learn-timeline-10.png"
import LearnImg11 from "./learn-timeline-11.png"

const timeline = [
    {
        date: "50 Million Years Ago — The First Horses",
        title: "North America: The Birthplace of the Horse",
        content: `
            Horses first evolved on this continent from small, fox-sized creatures 
            called Eohippus. Over millions of years, they adapted to changing climates 
            and ecosystems—developing larger bodies, long legs, and hooves designed 
            for speed and endurance on open grasslands. Fossils found across North 
            America reveal that horses were an integral part of ancient ecosystems, 
            shaping plant life and serving as prey for early predators.
        `,
        image: LearnImg1
    },
    {
        date: "10,000 Years Ago — Extinction and Migration",
        title: "The Horse Vanishes from North America",
        content: `
            At the end of the last Ice Age, drastic climate shifts and overhunting 
            led to the extinction of horses on this continent. But before disappearing, 
            some had migrated across the Bering land bridge into Asia—where they survived, 
            evolved further, and would one day return.
        `,
        image: LearnImg2
    },
    {
        date: "1500s — The Return with the Spanish",
        title: "Reintroduction of the Horse to the Americas",
        content: `
            Spanish conquistadors brought domesticated horses back to the New World in 
            the 1500s. Some escaped or were released, establishing free-roaming herds 
            that adapted swiftly to North American environments. These were the ancestors 
            of the mustangs—descendants of Iberian breeds who reclaimed the land of their 
            origin. Over time, Indigenous peoples integrated these horses into their 
            cultures, transforming mobility, hunting, and trade across the continent.
        `,
        image: LearnImg3
    },
    {
        date: "1700s-1800s — Horses and the American West",
        title: "Freedom, Frontier, and Conflict",
        content: `
            Wild and free-roaming horses became intertwined with the identity of the 
            American West. To many Native nations, they were spiritual relatives and 
            partners. To settlers and ranchers, they were essential tools for transportation, 
            herding, and expansion. As more settlers moved west, open range lands began to 
            disappear under fencing, grazing, and development. Conflicts over grazing 
            rights and land began to pit wild horses against the cattle industry.
        `,
        image: LearnImg4
    },
    {
        date: "Late 1800s-Early 1900s — Exploitation and Decline",
        title: "From Icon to Commodity",
        content: `
            By the turn of the century, millions of wild horses roamed the plains—but mass 
            captures, slaughter for pet food and fertilizer, and habitat loss decimated their 
            numbers. Entire herds were rounded up for war efforts or profit. Without laws to 
            protect them, wild horses were treated as pests or property, with little regard 
            for their ecological or cultural importance.
        `,
        image: LearnImg5
    },
    {
        date: "1950s — “Wild Horse Annie” and a National Awakening",
        title: "Velma Johnston Sparks a Movement",
        content: `
            In the 1950s, Velma Bronn Johnston—known as “Wild Horse Annie”—witnessed the brutal 
            methods used to capture mustangs. Outraged, she launched a grassroots campaign that 
            mobilized schoolchildren, communities, and lawmakers to act. Her efforts led to a 
            nationwide call for humane treatment of wild horses, ultimately influencing federal 
            protection decades later.
        `,
        image: LearnImg6
    },
    {
        date: "1971 — Federal Protection Becomes Law",
        title: "The Wild Free-Roaming Horses and Burros Act",
        content: `
            In response to overwhelming public support, Congress passed the Wild Free-Roaming 
            Horses and Burros Act, declaring these animals “living symbols of the historic and 
            pioneer spirit of the West.” The law placed them under federal protection and made 
            the Bureau of Land Management (BLM) responsible for their care. Initially, the law 
            promised safety—but its implementation would later prove complex and controversial.
        `,
        image: LearnImg7
    },
    {
        date: "1980s-1990s — Management Controversy",
        title: "Balancing Herds and Land Use",
        content: `
            With growing herd numbers, the BLM established “Appropriate Management Levels” 
            (AMLs), setting strict population caps that prioritized livestock grazing and 
            energy development over wild herds. Helicopter roundups and long-term holding 
            facilities became the standard practice. Critics argued that these methods broke 
            family bands, cost taxpayers hundreds of millions, and undermined the spirit of 
            the 1971 Act.
        `,
        image: LearnImg8
    },
    {
        date: "2000s-2020s — Reform, Science, and Advocacy",
        title: "Toward Humane, Sustainable Management",
        content: `
            In recent decades, biologists and advocates have turned to science-based, non-lethal 
            solutions. Fertility control vaccines like PZP have proven effective in stabilizing 
            herds without breaking their social structures. Rewilding projects and regenerative 
            grazing models—both in the U.S. and abroad—demonstrate how wild and semi-wild equines 
            can play a positive role in restoring ecosystems.
        `,
        image: LearnImg9
    },
    {
        date: "Today — Return to Freedom and the Path Forward",
        title: "Sanctuary, Conservation, and Coexistence",
        content: `
            Founded in 1998 by Neda DeMayo, Return to Freedom emerged as part of this new wave 
            of solutions—providing sanctuary to displaced horses and modeling humane management 
            through fertility control and regenerative land practices. Today, RTF advocates for 
            stronger protections, expanded sanctuary space, and a future where wild horses can 
            live freely on their native lands.
        `,
        image: LearnImg10
    }
]

const LearnPage = () => {
    return (
        <div className="w-full h-fit flex flex-col items-center justify-start gap-16">
            <Hero title="Learn" image={HeroImg} />
            <Header className="text-cinnamon">
                The Story of America's Wild Horses
            </Header>
            <AlternatingPictureLayout
                dividerColor="ink"
                alternateTitleColors={true}
                items={timeline.map(({ date, title, content, image }) => ({
                    superTitle: date,
                    title,
                    description: content,
                    image
                }))}
            />
            <div className="w-8/12 mb-16 mx-auto h-fit flex flex-col items-center justify-center gap-4 text-center">
                <div className="text-[25px]">
                    The Living Story
                </div>
                <div className="text-[48px] font-serif text-cinnamon">
                    Wild Horses as America's Heritage
                </div>
                <div className="text-[20px] mb-2">
                    From prehistoric origins to modern sanctuaries, the story of wild horses 
                    is inseparable from the story of this continent itself—of loss, return, 
                    resilience, and responsibility. Protecting them is not just about preserving 
                    history—it's about ensuring a living, thriving symbol of freedom endures 
                    for generations to come.
                </div>
                <Image
                    src={LearnImg11}
                    alt="Wild Horses as America's Heritage"
                    className="w-full aspect-auto object-cover" />
            </div>
        </div>
    )
}

export default LearnPage