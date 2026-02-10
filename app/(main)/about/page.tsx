import Image from "next/image";
import Link from "next/link";
import Button from "@/components/public-ui/Button";

import NewsCarousel from "../../../components/NewsCarousel";
import DocumentsWidget from "./DocumentsWidget";
import AboutHeroImg from "@/public/img/about_hero.jpg";
import NedaAndSpirit from "@/public/img/neda-and-spirit.jpg";
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

      <div className="w-full h-fit py-4 px-4 flex flex-col items-center justify-center gap-12">
        <ScrollReveal variant="fade-up" className="w-7/12">
          <div
            className="bg-pewter px-14 py-16 rounded-[33px]
                  flex flex-col items-center justify-center gap-4"
          >
            <div className="text-[70px] font-serif text-white">Mission</div>
            <div className="text-[24px] text-white text-center">
              Return to Freedom is dedicated to preserving the freedom, diversity,
              and habitat of America's wild horses and burros through sanctuary,
              education, advocacy, and conservation, while enriching the human
              spirit through direct experience with the natural world.
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={0.15} className="w-7/12">
          <div
            className="bg-pewter px-14 py-16 rounded-[33px]
                  flex flex-col items-center justify-center gap-4"
          >
            <div className="text-[48px] font-serif text-white">Vision</div>
            <div className="text-[20px] text-white text-center">
              Return to Freedom is poised to take our management model to the next
              level by creating a first-of-its-kind Wild Horse and Burro
              Conservancy and Wilderness Preserve. This historical Land Trust will
              ensure the conservation of disappearing pure in strain Spanish
              mustangs, expand our management model as it can be applied on wild
              horse ranges, and be home to natural family bands captured from
              federal lands.
            </div>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal variant="fade-in" className="w-full h-fit py-12 flex flex-col items-center justify-center gap-4">
        <div className="border-[3px] border-sage-green rounded-md max-w-11/12 md:max-w-1/2 h-fit flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2">
            <Image
              src={NedaAndSpirit}
              alt="Neda and Spirit"
              className="w-full aspect-square md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col items-start justify-center gap-2">
            <div className="text-[36px] font-serif text-sage-green">
              Our People
            </div>
            <div className="text-[16px] text-ink">
              The RTF team is dedicated to preserving the freedom, diversity,
              and habitat of America's wild horses and burros through sanctuary,
              education, advocacy, and conservation, while enriching the human
              spirit through direct experience with the natural world.
            </div>
            <Link href="/about/people">
              <Button color="burnt-orange" className="py-1">
                MEET THE TEAM
              </Button>
            </Link>
          </div>
        </div>
      </ScrollReveal>

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
