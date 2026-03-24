/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { NotebookPen } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import SeoHeader from 'components/seoHeader';
import Modal from 'components/modal';
import markdownToHtml from 'lib/markdownToHtml';
import { getPostsByFolder } from 'lib/api';

const All = 'All';

const propTypes = {
  years: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])),
  posts: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    coverImage: PropTypes.string,
  })),
};

const Books = ({ years = [], posts = [] }) => {
  const [selectedYear, setSelectedYear] = useState(All);
  const [selectedBook, setSelectedBook] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImgs, setLoadedImgs] = useState({});

  const onClickChip = (year) => {
    setSelectedYear(year);
  };

  const onSelectBook = async (book) => {
    const htmlContent = await markdownToHtml(book.content || '');
    if (!htmlContent) return;

    setSelectedBook({ ...book, content: htmlContent });
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredPosts = () => {
    if (selectedYear === All) {
      return posts;
    }
    return _.filter(posts, ({ date }) => new Date(date).getFullYear() === selectedYear);
  };

  const handleImageLoad = (url) => {
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
            onClick={() => onClickChip(year)}
          >
            {year}
          </button>
        ))}
      </div>
      <div className="text-sm text-primary-content mb-4">{`Total: ${filteredPosts().length}`}</div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredPosts().map(({
          slug, coverImage, title, author, content,
        }) => (
          <div
            key={slug}
            className="flex flex-col items-center"
          >
            <div
              className="relative w-fit mb-2 cursor-pointer"
              onClick={() => onSelectBook({ title, content })}
              onKeyDown={(e) => e.key === 'Enter' && onSelectBook({ title, content })}
              role="button"
              tabIndex={0}
            >
              {coverImage && (
                <div className="relative w-full aspect-[11/15]">
                  {!loadedImgs[coverImage] && (
                    <div className="absolute inset-0 bg-base-200 animate-pulse" />
                  )}
                  <LazyLoadImage
                    className="w-[110px] h-[150px] max-h-[150px] transition-transform duration-200 hover:scale-105"
                    src={`${coverImage}?w=164&h=164&fit=crop&auto=format`}
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
        title={selectedBook.title}
        content={selectedBook.content}
        onClose={onCloseModal}
      />
    </div>
  );
};

export async function getStaticProps() {
  const posts = getPostsByFolder({
    folder: 'books',
    fields: ['slug', 'title', 'coverImage', 'author', 'date', 'content'],
  });

  const years = _.chain(posts)
    .reduce((acc, { date }) => {
      acc.push(new Date(date).getFullYear());
      return acc;
    }, [All])
    .uniq()
    .value();

  return {
    props: {
      years,
      posts,
    },
  };
}

Books.propTypes = propTypes;

export default Books;
