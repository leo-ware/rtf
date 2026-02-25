import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit";

import NewsCarousel from "../../../components/NewsCarousel";
import DocumentsWidget from "./DocumentsWidget";
import OurPeopleBento from "./OurPeopleBento";
import AboutHeroImg from "@/public/img/about_hero.jpg";
import MissionImg from "@/public/img/ares-mares.jpg";
import VisionImg from "@/public/img/Owyhee-9925-scaled.jpg";
import Hero from "@/components/public-ui/Hero";
import Callout from "@/components/public-ui/Callout";
import ScrollReveal from "@/components/public-ui/ScrollReveal";

export const metadata = {
    title: "About Us - Return to Freedom"
}

const AboutPage = () => {
  return (
    <div className="w-full h-fit">
      <Hero title="About Us" image={AboutHeroImg} />

      <div className="w-full h-fit py-16 px-4 flex flex-col items-center justify-center gap-12">
        <ScrollReveal variant="fade-up">
          <Callout className="text-ink">
            Return to Freedom is a 501(c)(3) nonprofit wild horse sanctuary
            founded in the late 1990s by equine enthusiast Neda DeMayo. What began
            as a childhood dream blossomed into a thriving sanctuary dedicated to
            preserving the freedom, diversity, and natural habitats of America's
            wild horses and burros.
          </Callout>
        </ScrollReveal>
      </div>

      <div className="w-full relative h-[90vh] flex items-center justify-center overflow-hidden">
        <ImageWithAuthorCredit
          src={MissionImg}
          alt="Wild horses at Return to Freedom"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center"
          wrapperClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 max-w-4xl">
          <ScrollReveal variant="fade-up" duration={0.8}>
            <div className="text-[70px] font-serif text-white text-center">Mission</div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2} duration={0.8}>
            <div className="text-[22px] md:text-[24px] text-white text-center leading-relaxed">
              Return to Freedom is dedicated to preserving the freedom, diversity,
              and habitat of America's wild horses and burros through sanctuary,
              education, advocacy, and conservation, while enriching the human
              spirit through direct experience with the natural world.
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="w-full relative h-[90vh] flex items-center justify-center overflow-hidden">
        <ImageWithAuthorCredit
          src={VisionImg}
          alt="Wild horses in open landscape"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center"
          wrapperClassName="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 max-w-4xl">
          <ScrollReveal variant="fade-up" duration={0.8}>
            <div className="text-[56px] md:text-[64px] font-serif text-white text-center">Vision</div>
          </ScrollReveal>
          <ScrollReveal variant="fade-up" delay={0.2} duration={0.8}>
            <div className="text-[18px] md:text-[20px] text-white text-center leading-relaxed">
              Return to Freedom is poised to take our management model to the next
              level by creating a first-of-its-kind Wild Horse and Burro
              Conservancy and Wilderness Preserve. This historical Land Trust will
              ensure the conservation of disappearing pure in strain Spanish
              mustangs, expand our management model as it can be applied on wild
              horse ranges, and be home to natural family bands captured from
              federal lands.
            </div>
          </ScrollReveal>
        </div>
      </div>

      <OurPeopleBento />

      <ScrollReveal variant="fade-up">
        <NewsCarousel bgColor="transparent" title="RTF in the News" />
      </ScrollReveal>

      <ScrollReveal variant="fade-up">
        <DocumentsWidget />
      </ScrollReveal>
    </div>
  );
};

export default AboutPage;
