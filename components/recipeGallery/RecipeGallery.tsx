import { useId, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface RecipeGalleryProps {
  title: string;
  coverImage?: string;
  gallery?: string[];
}

const RecipeGallery = ({ title, coverImage, gallery = [] }: RecipeGalleryProps) => {
  const [loadedImgs, setLoadedImgs] = useState<Record<string, boolean>>({});
  const galleryId = useId();
  const images = gallery.length > 0
    ? [coverImage, ...gallery].filter((image): image is string => Boolean(image))
    : coverImage ? [coverImage] : [];
  const hasGallery = images.length > 0;

  const handleImageLoad = (image: string) => {
    setLoadedImgs((prev) => ({ ...prev, [image]: true }));
  };

  return (
    <>
      {hasGallery && images.length === 1 ? (
        <div className="relative">
          {!loadedImgs[images[0]] && (
            <div className="absolute inset-0 skeleton rounded-3xl" />
          )}
          <Image
            className="rounded-3xl w-full h-auto"
            src={images[0]}
            alt={title}
            width={1200}
            height={900}
            sizes="(min-width: 768px) 33vw, 100vw"
            loading="eager"
            onLoad={() => handleImageLoad(images[0])}
          />
        </div>
      ) : hasGallery && images.length > 1 ? (
        <div className="carousel w-full rounded-box group">
          {images.map((image, index) => {
            const prevIndex = index === 0 ? images.length - 1 : index - 1;
            const nextIndex = index === images.length - 1 ? 0 : index + 1;

            return (
              <div key={image} id={`slide-${galleryId}-${index}`} className="carousel-item relative w-full">
                {!loadedImgs[image] && (
                  <div className="absolute inset-0 skeleton rounded-box" />
                )}
                <Image
                  className="w-full h-auto rounded-box"
                  src={image}
                  alt={`${title} - ${index + 1}`}
                  width={1200}
                  height={900}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onLoad={() => handleImageLoad(image)}
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between opacity-0 transition-opacity group-hover:opacity-100">
                  <a
                    href={`#slide-${galleryId}-${prevIndex}`}
                    className="btn btn-circle"
                    aria-label="Previous image"
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(`slide-${galleryId}-${prevIndex}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start',
                      });
                    }}
                  >
                    <ChevronLeft size={24} />
                  </a>
                  <a
                    href={`#slide-${galleryId}-${nextIndex}`}
                    className="btn btn-circle"
                    aria-label="Next image"
                    onClick={(event) => {
                      event.preventDefault();
                      document.getElementById(`slide-${galleryId}-${nextIndex}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start',
                      });
                    }}
                  >
                    <ChevronRight size={24} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default RecipeGallery;
