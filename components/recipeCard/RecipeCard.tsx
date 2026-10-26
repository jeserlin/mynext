import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { RecipeType } from 'types/recipe';

export interface RecipeCardProps {
  slug: string;
  title: string;
  type: RecipeType;
  coverImage?: string;
  labels: string[];
  loading?: 'eager' | 'lazy';
}

const RecipeCard = ({
  slug,
  title,
  type,
  coverImage,
  labels,
  loading = 'lazy',
}: RecipeCardProps) => {
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const visibleLabels = labels.filter((label) => label.toLowerCase() !== 'others');

  return (
    <Link
      href={`/${type}/${slug}`}
      className="group block overflow-hidden rounded-lg border border-[#e8ddd0] bg-[#fcfaf6] transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b5e53]"
    >
      <div className="recipe-card-media relative aspect-[4/3] w-full overflow-hidden bg-[#f0e6d9] xl:aspect-[3/2]">
        {coverImage ? (
          <>
            {loadedImage !== coverImage && <div className="skeleton absolute inset-0" />}
            <Image
              fill
              src={coverImage}
              alt=""
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 50vw"
              className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${loadedImage === coverImage ? 'opacity-100' : 'opacity-0'}`}
              loading={loading}
              onLoad={() => setLoadedImage(coverImage)}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-lg text-[#705b4c">Recipe photo</div>
        )}
      </div>
      <div className="recipe-card-content p-2.5 sm:p-3 xl:p-2.5">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 sm:mb-2">
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#a65f40] sm:text-[10px] sm:tracking-[0.16em]">
            {type}
          </span>
          {visibleLabels.slice(0, 1).map((label) => (
            <span key={label} className="text-[10px] text-[#705b4c] sm:text-xs">{label}</span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="recipe-card-title line-clamp-2 font-normal text-base leading-snug text-[#3d2a20] transition-colors group-hover:text-[#6b5e53] sm:text-lg xl:text-base">
            {title}
          </h3>
          <span className="shrink-0 text-sm text-[#6b5e53] sm:text-lg" aria-hidden="true">↗</span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
