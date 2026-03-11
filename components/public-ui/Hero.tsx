import { StaticImageData } from "next/image";
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit";

const Hero = ({ title, image, authorCredit }: { title: string; image: StaticImageData; authorCredit?: string }) => {
  return (
    <div
      style={{ height: "calc(100vh - 135px)" }}
      className="
                w-full
                relative flex items-center justify-center bg-sage-green"
    >
      <ImageWithAuthorCredit
        src={image}
        alt="About Hero"
        className="z-0 absolute top-0 left-0 w-full h-full object-cover object-center"
        fill
        wrapperClassName="z-0 absolute top-0 left-0 w-full h-full"
        authorCredit={authorCredit}
      />
      <div className="z-10 underline decoration-2 underline-offset-8 border-white text-white text-[48px] sm:text-[60px] md:text-[70px] lg:text-[80px] font-serif px-8 text-center">
        {title}
      </div>
    </div>
  );
};

export default Hero;
