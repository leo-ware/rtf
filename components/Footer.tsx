import Link from "next/link"
import Image from "next/image"
import { FaFacebook, FaInstagram, FaYoutube, FaVimeo } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { MdOutlineEmail } from "react-icons/md"

import RTFLogoWhite from "@/public/img/rtf_logo_white.svg"

export default function Footer() {
    return (
        <footer className="w-full py-16 flex items-center justify-center bg-[url('/img/footer-bg-blurred.png')] bg-cover bg-center">
            <div className="w-fit h-fit flex flex-col md:flex-row gap-4">
                <div className="px-4 hidden md:block">
                    <Image src={RTFLogoWhite} alt="logo" width={180} height={114} />
                </div>
                
                <div className="text-white">
                    <div className="text-sm font-bold">About Us</div>
                    <div className="text-xs max-w-[340px]">
                        Return to Freedom is a national nonprofit organization dedicated to
                        wild horse preservation through sanctuary, education, conservation,
                        and advocacy since 1998. It also operates the American Wild Horse
                        Sanctuary at three California locations, caring for more than 450 wild
                        horses and burros.
                        <br />
                        PO Box 926, Lompoc, CA 93438 USA
                        <br />
                        (805) 737-9246
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="flex items-center gap-2 text-white">
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
