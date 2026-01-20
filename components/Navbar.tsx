"use client";

import Image from "next/image";
import Link from "next/link";

import RTFLogoWhite from "@/public/img/rtf_logo_white.svg";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { useState } from "react";

const HeaderLink = (props: {
  href: string;
  text: string;
  external?: boolean;
}) => {
  return (
    <Link
      href={props.href}
      className="relative no-wrap group text-white text-[16px] font-semibold"
      target={props.external ? "_blank" : undefined}
      rel={props.external ? "noopener noreferrer" : undefined}
    >
      <div
        className="absolute bottom-0 left-0
                right-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100
                transition-transform origin-center"
      />
      {props.text}
    </Link>
  );
};

const MobileHeaderLink = (props: {
  href: string;
  text: string;
  onClick: () => void;
}) => {
  return (
    <Link
      href={props.href}
      className="relative text-white "
      onClick={props.onClick}
    >
      {props.text}
    </Link>
  );
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={`
            w-full h-fit bg-pewter max-w-screen font-bold
            xl:h-[135px]
            `}
    >
      <nav
        className={`
                w-full hidden py-2 px-[5%]
                xl:flex lg:items-center lg:gap-0 lg:px-4
                xl:gap-6 xl:px-[3%]
                `}
      >
        <div className="flex-1 flex items-center justify-end gap-6">
          <HeaderLink href="/about" text="About" />
          <HeaderLink href="/#what-we-do" text="What We Do" />
          <HeaderLink href="/resources/learn" text="Learn" />
          <HeaderLink href="/resources/news" text="News" />
          <HeaderLink href="/horses/our-horses" text="Our Horses" />
        </div>

        <div className="w-[180px] flex justify-center">
          <Link href="/" className="flex-shrink-0">
            <Image src={RTFLogoWhite} alt="logo" width={180} height={114} />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-start gap-6">
          <HeaderLink
            href="/what-we-do/advocacy#take-action"
            text="Take Action"
          />
          <HeaderLink href="/visit-us" text="Visit Us" />
          <HeaderLink
            href="https://shop.returntofreedom.org"
            text="Shop"
            external
          />

          <div className="flex items-center gap-4">
            <Link
              href="/donate"
              className={`rounded-lg bg-cinnamon border-1 border-cinnamon w-[100px] flex items-center
                                    justify-center py-1 text-white text-sm`}
            >
              DONATE
            </Link>

            <Link
              href="/contact"
              className={`rounded-lg border-1 border-white w-[100px] flex items-center
                                    justify-center py-1 text-white text-sm`}
            >
              SUBSCRIBE
            </Link>
          </div>
        </div>
      </nav>

      <nav
        className="
                xl:hidden
                flex flex-row items-center justify-between
                top-0 left-0 w-screen p-2
                md:px-8
                "
      >
        <Link href="/" className="flex-shrink-0">
          <Image
            src={RTFLogoWhite}
            alt="logo"
            className="w-[90px] h-[57px]"
            width={180}
            height={114}
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/donate"
            className={`rounded-lg bg-burnt-orange border-1 border-burnt-orange w-[100px] flex items-center
                                    justify-center py-1 text-white text-sm`}
          >
            DONATE
          </Link>

          <button
            aria-label="open menu"
            className="pr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <IoMdMenu size={30} className="text-seashell" />
          </button>
        </div>
      </nav>

      <div
        className="z-50 bg-pewter w-screen h-screen fixed top-0 left-0
                transition-transform xl:transition-none duration-300 ease-in-out"
        style={{
          transform: isMobileMenuOpen ? "translateX(0)" : "translateX(110vw)",
        }}
      >
        <div className="absolute top-6 right-4">
          <button
            aria-label="close menu"
            className="pr-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <IoMdClose
              // size={30}
              className={`
                                text-seashell ${!isMobileMenuOpen && "animate-spin"}
                                text-[30px]
                                md:text-[60px]
                            `}
            />
          </button>
        </div>

        <div
          className="
                        absolute left-6 bottom-6 flex flex-col items-start justify-end
                        font-serif font-base underline underline-offset-4
                        gap-4 text-lg
                        md:text-4xl md:p-16 md:gap-6"
        >
          <MobileHeaderLink
            href="/about"
            text="About"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileHeaderLink
            href="/what-we-do"
            text="What We Do"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileHeaderLink
            href="/resources/learn"
            text="Learn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileHeaderLink
            href="/resources/news"
            text="News"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileHeaderLink
            href="/horses/our-horses"
            text="Our Horses"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileHeaderLink
            href="/take-action"
            text="Take Action"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <MobileHeaderLink
            href="/visit-us"
            text="Visit Us"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
