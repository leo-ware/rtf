import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface ImageProps {
  src: StaticImageData | string;
  alt: string;
  colSpan?: string;
  rowSpan?: string;
}

interface EventGalleryProps {
  images: ImageProps[];
}

const EventGallery: React.FC<EventGalleryProps> = ({ images }) => {
  return (
    <div className="w-full bg-white pt-4 sm:pt-6 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[250px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative ${image.colSpan || ''} ${image.rowSpan || ''}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              placeholder="blur"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventGallery;