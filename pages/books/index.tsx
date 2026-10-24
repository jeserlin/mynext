import { useState } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { NotebookPen } from 'lucide-react';

import Modal from 'components/modal';
import SeoHeader from 'components/seoHeader';
import { getPostsByFolder } from 'lib/api';
import markdownToHtml from 'lib/markdownToHtml';
import type { BookNote, BookPost } from 'types/book';

const All = 'All';

interface BooksProps {
  years: Array<string | number>;
  posts: BookPost[];
}

const Books = ({ years, posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [selectedYear, setSelectedYear] = useState<string | number>(All);
  const [selectedBook, setSelectedBook] = useState<BookNote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImgs, setLoadedImgs] = useState<Record<string, boolean>>({});

  const onSelectBook = async (book: BookNote) => {
    const htmlContent = await markdownToHtml(book.content || '');
    if (!htmlContent) return;

    setSelectedBook({ ...book, content: htmlContent });
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredPosts = selectedYear === All
    ? posts
    : posts.filter(({ date }) => new Date(date).getFullYear() === selectedYear);

  const handleImageLoad = (url: string) => {
    setLoadedImgs((prev) => ({ ...prev, [url]: true }));
  };

  return (
    <div>
      <SeoHeader
        title="Books"
        description="All about books"
      />
      <div className="flex flex-row gap-2 mb-6 overflow-y-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {years.map((year) => (
          <button
            type="button"
            key={year}
            className={`btn btn-sm btn-secondary rounded-lg hover:!text-white ${selectedYear === year
              ? 'text-white'
              : 'btn-outline'
            }`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>
      <div className="text-sm text-primary-content mb-4">{`Total: ${filteredPosts.length}`}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredPosts.map(({
          slug, coverImage, title, author, content,
        }) => (
          <div
            key={slug}
            className="flex flex-col items-center"
          >
            <div
              className="relative w-fit mb-2 cursor-pointer"
              onClick={() => void onSelectBook({ title, content })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void onSelectBook({ title, content });
              }}
              role="button"
              tabIndex={0}
            >
              {coverImage && (
                <div className="relative w-full aspect-[11/15]">
                  {!loadedImgs[coverImage] && (
                    <div className="absolute inset-0 skeleton" />
                  )}
                  <Image
                    className="w-[110px] h-[150px] max-h-[150px] transition-transform duration-200 hover:scale-105"
                    src={`${coverImage}?w=164&h=164&fit=crop&auto=format`}
                    alt={title}
                    height={150}
                    width={110}
                    onLoad={() => handleImageLoad(coverImage)}
                  />
                </div>
              )}
              {content && (
                <div className="absolute top-0 -right-1 bg-[#ece7df] rounded-lg text-black p-1">
                  <NotebookPen size={20} />
                </div>
              )}
            </div>
            <div className="text-sm font-bold text-primary-content mb-1 text-center">{title}</div>
            <div className="text-sm text-primary-content">{author}</div>
          </div>
        ))}
      </div>
      <Modal
        open={isModalOpen}
        title={selectedBook?.title}
        content={selectedBook?.content}
        onClose={onCloseModal}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps<BooksProps> = async () => {
  const posts = getPostsByFolder({
    folder: 'books',
    fields: ['slug', 'title', 'coverImage', 'author', 'date', 'content'],
  }) as BookPost[];

  const years = [
    All,
    ...new Set(posts.map(({ date }) => new Date(date).getFullYear())),
  ];

  return {
    props: {
      years,
      posts,
    },
  };
};

export default Books;
