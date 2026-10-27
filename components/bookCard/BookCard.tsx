import { useState } from 'react';
import Image from 'next/image';
import { NotebookPen } from 'lucide-react';

import type { BookNote } from 'types/book';

export interface BookCardProps {
  title: string;
  author: string;
  coverImage?: string;
  content?: string;
  loading?: 'eager' | 'lazy';
  onSelectNotes: (book: BookNote) => void;
}

const BookCard = ({
  title,
  author,
  coverImage,
  content,
  loading = 'lazy',
  onSelectNotes,
}: BookCardProps) => {
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const hasNotes = Boolean(content?.trim());
  const isPublitCover = coverImage?.startsWith('https://media.publit.io/') || false;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={!hasNotes}
        aria-label={hasNotes ? `Read notes for ${title}` : undefined}
        className="group relative mb-2 w-fit enabled:cursor-pointer disabled:pointer-events-none"
        onClick={() => onSelectNotes({ title, content })}
      >
        {coverImage ? (
          <div className="relative w-full aspect-[11/15]">
            {loadedImage !== coverImage && <div className="absolute inset-0 skeleton" />}
            <Image
              className="w-[110px] h-[150px] max-h-[150px] transition-transform duration-200 group-hover:scale-105"
              src={isPublitCover ? `${coverImage}?w=164&h=164&fit=crop&auto=format` : coverImage}
              unoptimized={!isPublitCover}
              alt={title}
              height={150}
              width={110}
              loading={loading}
              onLoad={() => setLoadedImage(coverImage)}
            />
          </div>
        ) : (
          <div className="flex h-[150px] w-[110px] items-center justify-center bg-[#ece7df] px-2 text-center text-xs text-primary-content">
            No cover
          </div>
        )}
        {hasNotes && (
          <div className="absolute top-0 -right-1 bg-[#ece7df] rounded-lg text-black p-1">
            <NotebookPen size={20} />
          </div>
        )}
      </button>
      <div className="text-sm font-bold text-primary-content mb-1 text-center">{title}</div>
      <div className="text-sm text-primary-content">{author}</div>
    </div>
  );
};

export default BookCard;
