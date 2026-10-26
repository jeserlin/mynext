import { useState } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import SeoHeader from 'components/seoHeader';
import { getPostsByFolder } from 'lib/api';
import { formatDate } from 'lib/convertors';
import type { PostSummary } from 'types/post';

interface TechProps {
  posts: PostSummary[];
}

const Tech = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [loadedImgs, setLoadedImgs] = useState<Record<string, boolean>>({});

  const handleImageLoad = (coverImage: string) => {
    setLoadedImgs((prev) => ({ ...prev, [coverImage]: true }));
  };

  return (
    <div>
      <SeoHeader
        title="Tech"
        description="All about tech"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(({
          slug, title, coverImage, desc, date,
        }, index) => (
          <Link key={slug} href={`/tech/${slug}`}>
            <div className="flex w-full cursor-pointer">
              <div className="w-1/4 flex-shrink-0">
                {coverImage && (
                  <div className="relative aspect-square">
                    {!loadedImgs[coverImage] && (
                      <div className="absolute inset-0 skeleton rounded-lg" />
                    )}
                    <Image
                      fill
                      sizes="(min-width: 768px) 12.5vw, 25vw"
                      className={`rounded-lg object-cover ${!loadedImgs[coverImage] ? 'invisible' : ''}`}
                      src={coverImage}
                      alt={title}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      onLoad={() => handleImageLoad(coverImage)}
                    />
                  </div>
                )}
              </div>
              <div className="w-3/4 ml-4 p-4 rounded-lg bg-custom-light flex flex-col justify-between items-start transition-shadow duration-300 hover:shadow-lg">
                <div className="font-semibold text-text-primary mb-4">
                  {title}
                </div>
                <div className="text-sm text-text-primary mb-2">
                  {desc}
                </div>
                <div className="text-xs text-text-primary/60">
                  {`更新時間: ${formatDate(date)}`}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<TechProps> = async () => {
  const posts = getPostsByFolder({
    folder: 'tech',
    fields: ['slug', 'title', 'coverImage', 'desc', 'date'],
  }) as PostSummary[];

  const sortedPosts = posts.sort((post1, post2) => (
    (post1.date || '') > (post2.date || '') ? -1 : 1
  ));

  return {
    props: {
      posts: sortedPosts,
    },
  };
};

export default Tech;
