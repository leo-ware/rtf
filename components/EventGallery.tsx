import React from 'react';
import { StaticImageData } from 'next/image';
import ImageWithAuthorCredit from "@/components/images/ImageWithAuthorCredit";

type EventGalleryImageProps = {
  src: StaticImageData | string;
  alt: string;
  colSpan?: string;
  rowSpan?: string;
  authorCredit?: string;
}

type EventGalleryProps = {
  images: EventGalleryImageProps[];
}

const EventGallery: React.FC<EventGalleryProps> = ({ images }) => {
  return (
    <div className="w-full bg-white pt-4 sm:pt-6 pb-16 sm:pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[250px]">
        {images.map((image, index) => (
          <ImageWithAuthorCredit
            key={index}
            src={image.src}
            alt={image.alt}
            fill
            style={{ objectFit: "cover" }}
            placeholder="blur"
            wrapperClassName={`relative ${image.colSpan || ''} ${image.rowSpan || ''}`}
            authorCredit={image.authorCredit}
          />
        ))}
      </div>
    </div>
  );
};

export default EventGallery;