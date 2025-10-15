import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button'; 

import WeddingHeroImg from '@/public/img/wedding_gallery_1.jpg';
import EventGallery from '@/components/EventGallery';

// Import all gallery images
import galleryImg1 from '@/public/img/wedding_gallery_1.jpg';
import galleryImg2 from '@/public/img/wedding_gallery_2.jpg';
import galleryImg3 from '@/public/img/wedding_gallery_3.jpg';
import galleryImg4 from '@/public/img/wedding_gallery_4.jpg';
import galleryImg5 from '@/public/img/wedding_gallery_5.jpg';
import galleryImg6 from '@/public/img/wedding_gallery_6.jpg';
import galleryImg7 from '@/public/img/wedding_gallery_7.jpg';

const weddingImages = [
  { src: galleryImg1, alt: 'Wedding gallery photo 1' },
  { src: galleryImg4, alt: 'Wedding gallery photo 4', rowSpan: 'row-span-2' },
  { src: galleryImg6, alt: 'Wedding gallery photo 6' },
  { src: galleryImg2, alt: 'Wedding gallery photo 2' },
  { src: galleryImg7, alt: 'Wedding gallery photo 7', rowSpan: 'row-span-2' },
  { src: galleryImg3, alt: 'Wedding gallery photo 3' },
  { src: galleryImg5, alt: 'Wedding gallery photo 5' },
];

export default function WeddingsPage() {
  return (
    <div className="bg-white">
      {/* Hero Image Section */}
      <div className="relative w-full">
        <Image
          src={WeddingHeroImg}
          alt="A beautiful wedding setup at the sanctuary"
          className="w-full h-auto opacity-70" // You can adjust opacity as needed
          priority
          placeholder="blur"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          {/* The title can be overlaid on the hero image if desired */}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-6xl tracking-tight text-pewter">
            Host Your Event
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <div className="mt-10 w-fit mx-auto">
            <Link href="/contact">
              <Button color="burnt-orange">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Weddings Section */}
      <div className="pt-16 sm:pt-24 pb-4 sm:pb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-5xl tracking-tight text-sage-green">
            Weddings
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>

      {/* Image Gallery Section */}
      <EventGallery images={weddingImages} />

      {/* Fundraisers Section */}
      <div className="pt-16 sm:pt-24 pb-4 sm:pb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-5xl tracking-tight text-pewter">
            Fundraisers
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>

      {/* Image Gallery Section for Fundraisers */}
      <EventGallery images={weddingImages} />

      {/* Retreats Section */}
      <div className="pt-16 sm:pt-24 pb-4 sm:pb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-5xl tracking-tight text-sage-green">
            Retreats
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>

      {/* Image Gallery Section for Retreats */}
      <EventGallery images={weddingImages} />

      {/* Final CTA Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-5xl tracking-tight text-pewter">
            Interested in hosting a different kind of event at RTF?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          <div className="mt-10 w-fit mx-auto">
            <Link href="/contact">
              <Button color="burnt-orange">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
