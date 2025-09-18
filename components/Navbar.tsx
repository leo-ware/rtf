"use client"

import Image from "next/image"
import Link from "next/link"

import { FaAngleDown } from "react-icons/fa"

export default function Navbar() {
    return (
        <header className="bg-white max-w-screen">
            <nav className="w-full">
                <div className="w-full bg-white flex items-center justify-between py-4 px-8">
                    <Link href="/">
                        <Image src="/img/RTFLogo_2024-Wild-Horses.png" alt="logo" width={150} height={100} />
                    </Link>

                    <div className="flex items-baseline gap-4 text-lg">
                        <div className="relative group">
                            <div className="flex items-center">
                                <Link href="/about" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                                    About Us
                                </Link>
                                <FaAngleDown className="text-gray-700" />
                            </div>
                            <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-1">
                                    <Link href="/about/who-we-are" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Who We Are</Link>
                                    <Link href="/about/our-mission" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Our Mission</Link>
                                    <Link href="/about/our-story" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Our Story</Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <Link href="/about/conservation" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Conservation</Link>
                                    <Link href="/about/sanctuary" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Sanctuary</Link>
                                    <Link href="/about/education" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Education</Link>
                                    <Link href="/about/advocacy" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Advocacy</Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <Link href="/about/staff" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Staff</Link>
                                    <Link href="/about/board" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Board of Directors</Link>
                                    <Link href="/about/financials" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Financials</Link>
                                    <Link href="/about/supporters" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Supporters and Partners</Link>
                                </div>
                            </div>
                        </div>
                        <Link href="/our-horses" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                            Our Horses
                        </Link>
                        <Link href="/burros" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                            Burros
                        </Link>
                        <Link href="/news" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                            News
                        </Link>
                        <Link href="/get-involved" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                            Get Involved
                        </Link>
                        <div className="relative group">
                            <div className="flex items-center">
                                <Link href="/visit" className="text-gray-700 hover:text-gray-900 px-3 py-2 font-medium">
                                    Visit / Events
                                </Link>
                                <FaAngleDown className="text-gray-700" />
                            </div>
                            <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-1">
                                    <Link href="/visit/calendar" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Event Calendar</Link>
                                    <Link href="/visit/programs" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Programs and Events</Link>
                                    <Link href="/visit/photo-safaris" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Photo Safaris</Link>
                                    <Link href="/visit/tours" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tours</Link>
                                    <Link href="/visit/meet-spirit" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Meet Spirit</Link>
                                    <Link href="/visit/volunteer" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Volunteer</Link>
                                    <Link href="/visit/your-event" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Your Event at the Wild Horse Sanctuary</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
            {/* 
                <div className="flex justify-between items-center h-16">
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                            <Link href="/about" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">About Us</Link>
                            <Link href="/our-horses" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">Our Horses</Link>
                            <Link href="/burros" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">Burros</Link>
                            <Link href="/news" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">News</Link>
                            <Link href="/get-involved" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">Get Involved</Link>
                            <Link href="/visit" className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium">Visit / Events</Link>
                            <div className="pt-4 pb-3 border-t border-gray-200">
                                <Link href="/donate" className="bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700">Donate</Link>
                                <Link href="/subscribe" className="bg-gray-200 text-gray-700 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-300 mt-2">Subscribe</Link>
                            </div>
                        </div>
                    </div>
                )} */}

            </nav>
        </header>
    )
}
