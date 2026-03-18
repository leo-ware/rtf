import NewsCarousel from "../../../components/NewsCarousel";
import DocumentsWidget from "./DocumentsWidget";
import OurPeopleBento from "./OurPeopleBento";
import AboutHeroImg from "@/public/img/about_hero.jpg";
import MissionImg from "@/public/img/mission-image.jpg";
import VisionImg from "@/public/img/vision-image.jpg";
import Hero from "@/components/public-ui/Hero";
import Callout from "@/components/public-ui/Callout";
import ScrollReveal from "@/components/public-ui/ScrollReveal";
import CinematicSection from "@/components/public-ui/CinematicSection";
import StatsBar from "@/components/StatsBar";

export const metadata = {
    title: "About Us - Return to Freedom"
}

const AboutPage = () => {
  return (
    <div className="w-full h-fit">
      <Hero title="About Us" image={AboutHeroImg} />

      <div className="w-full h-fit py-16 px-4 flex flex-col items-center justify-center gap-12">
        <ScrollReveal variant="fade-up">
          <Callout className="text-pewter">
            Return to Freedom is a 501(c)(3) nonprofit wild horse sanctuary
            founded in 1997 by equine enthusiast Neda DeMayo. What began
            as a childhood dream blossomed into a thriving sanctuary dedicated to
            preserving the freedom, diversity, and natural habitats of America's
            wild horses and burros.
          </Callout>
        </ScrollReveal>
      </div>

      <CinematicSection
        image={MissionImg}
        imageAlt="Wild horses at Return to Freedom"
        title="Mission"
      >
        Return to Freedom is dedicated to preserving the freedom, diversity,
        and habitat of America's wild horses and burros through sanctuary,
        education, advocacy, and conservation, while enriching the human
        spirit through direct experience with the natural world.
      </CinematicSection>

      <CinematicSection
        image={VisionImg}
        imageAlt="Wild horses in open landscape"
        title="Vision"
        titleSize="text-[56px] md:text-[64px]"
        textSize="text-[18px] md:text-[20px]"
      >
        Return to Freedom is poised to take our management model to the next
        level by creating a first-of-its-kind Wild Horse and Burro
        Conservancy and Wilderness Preserve. This historical Land Trust will
        ensure the conservation of disappearing pure in strain Spanish
        mustangs, expand our management model as it can be applied on wild
        horse ranges, and be home to natural family bands captured from
        federal lands.
      </CinematicSection>

      <OurPeopleBento />

      <ScrollReveal variant="fade-up">
        <NewsCarousel bgColor="transparent" title="RTF in the News" />
      </ScrollReveal>

      <ScrollReveal variant="fade-up">
        <DocumentsWidget />
      </ScrollReveal>

      <StatsBar />
    </div>
  );
};

export default AboutPage;
