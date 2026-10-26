import { useState } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

import BookCard from 'components/bookCard';
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

  return (
    <div>
      <SeoHeader
        title="Books"
        description="All about books"
      />
      <h1 className="mb-4 font-normal text-2xl leading-tight text-[#3d2a20] sm:text-3xl">Books</h1>
      <div className="flex flex-nowrap gap-2 mb-6 overflow-x-auto overflow-y-hidden scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {years.map((year) => (
          <button
            type="button"
            key={year}
            aria-pressed={selectedYear === year}
            className={`btn btn-sm btn-secondary shrink-0 rounded-lg hover:!text-white ${selectedYear === year
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
        {filteredPosts.map((book, index) => (
          <BookCard
            key={book.slug}
            title={book.title}
            author={book.author}
            coverImage={book.coverImage}
            content={book.content}
            loading={index === 0 ? 'eager' : 'lazy'}
            onSelectNotes={(selected) => void onSelectBook(selected)}
          />
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
