import Link from "next/link"
import Image from "next/image"
import { FaFacebook, FaInstagram, FaYoutube, FaVimeo } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { MdOutlineEmail } from "react-icons/md"

import RTFLogoWhite from "@/public/img/rtf_logo_white.svg"

export default function Footer() {
    return (
        <footer className="w-full py-16 flex items-center justify-center bg-[url('/img/footer-bg-blurred.png')] bg-cover bg-center">
            <div className="w-11/12 h-fit flex flex-col md:flex-row justify-start md:justify-between gap-4">
                <div className="px-4 mr-4 hidden md:block">
                    <Image src={RTFLogoWhite} alt="logo" width={180} height={114} />
                </div>
                
                <div className="text-white">
                    <div className="text-md font-[500]">We're a Nonprofit</div>
                    <div className="text-xs max-w-[340px]">
                        Return to Freedom is a 501(c)3 nonprofit organization and depends on the kind 
                        and generous donations of people like you to keep our wild horses and burros 
                        fed, as well as to continue our invaluable work in legislation, lobbying, and 
                        hands-on rescue.
                    </div>
                </div>

                <div className="text-white">
                    <div className="text-md font-[500]">Contact Us</div>
                    <div className="text-xs max-w-[340px]">
                    We love to hear from our supporters, as well as anyone with questions about our 
                    life-saving work, about wild horses and burros in general, and especially about 
                    your interest in helping us keep wild horses and burros in their rightful place 
                    on America’s public lands.
                    </div>
                </div>

                <div className="flex items-center md:mx-4">
                    <div className="flex items-center gap-3 text-white">
                        <Link href="/">
                            <FaInstagram size={30}/>
                        </Link>
                        <Link href="/">
                            <FaFacebook size={30}/>
                        </Link>
                        <Link href="/">
                            <FaYoutube size={30}/>
                        </Link>
                        <Link href="/">
                            <FaXTwitter size={30}/>
                        </Link>
                        <Link href="/">
                            <MdOutlineEmail size={30}/>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
