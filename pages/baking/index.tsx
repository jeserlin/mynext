import { useState } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import SeoHeader from 'components/seoHeader';
import { getRecipesByType } from 'lib/recipes';
import type { RecipeSummary } from 'types/recipe';

interface BakingProps {
  posts: RecipeSummary[];
}

const Baking = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [loadedImgs, setLoadedImgs] = useState<Record<string, boolean>>({});

  const handleImageLoad = (coverImage: string) => {
    setLoadedImgs((prev) => ({ ...prev, [coverImage]: true }));
  };

  return (
    <div>
      <SeoHeader
        title="Baking"
        description="All about baking"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(({
          slug, title, coverImage, ingredient,
        }) => (
          <Link key={slug} href={`/baking/${slug}`}>
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
                      onLoad={() => handleImageLoad(coverImage)}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start transition-shadow  w-3/4 ml-4 p-4 rounded-lg bg-custom-light duration-300 hover:shadow-lg">
                <div className="font-semibold text-text-primary mb-4">
                  {title}
                </div>
                <div className="text-sm text-text-primary">
                  {`食材: ${ingredient.join(', ')}`}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<BakingProps> = async () => {
  const posts = await getRecipesByType({
    type: 'baking',
    fields: ['slug', 'date', 'title', 'coverImage', 'ingredient'],
  }) as RecipeSummary[];

  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
};

export default Baking;
