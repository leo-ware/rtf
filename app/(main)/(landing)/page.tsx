import HeroSection from "./hero-section"
import MissionSection from "./mission-section"
import FourPillarsSection from "./four-pillars-section"
import SpiritSection from "./spirit-section"

const HomePage = () => {
    return (
        <div className="flex-1">
            <HeroSection />
            <MissionSection />
            <FourPillarsSection />
            <SpiritSection />
        </div>
    )
}

export default HomePage