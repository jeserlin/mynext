import { useState } from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import SeoHeader from 'components/seoHeader';
import { getRecipesByType } from 'lib/recipes';
import type { RecipeSummary } from 'types/recipe';

const All = 'All';

interface CookingProps {
  labelList: string[];
  posts: RecipeSummary[];
}

const Cooking = ({
  labelList,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [selectedLabel, setSelectedLabel] = useState(All);
  const [loadedImgs, setLoadedImgs] = useState<Record<string, boolean>>({});

  const handleImageLoad = (coverImage: string) => {
    setLoadedImgs((prev) => ({ ...prev, [coverImage]: true }));
  };

  const filteredPosts = selectedLabel === All
    ? posts
    : posts.filter(({ labels }) => labels?.includes(selectedLabel));

  return (
    <div>
      <SeoHeader
        title="Cooking"
        description="All about cooking"
      />
      <div className="flex flex-row gap-2 mb-6">
        {labelList.map((label) => (
          <button
            key={label}
            type="button"
            className={`btn btn-sm btn-secondary rounded-lg hover:!text-white ${
              selectedLabel === label
                ? 'text-white'
                : 'btn-outline'
            }`}
            onClick={() => setSelectedLabel(label)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map(({
          slug, title, coverImage, ingredient,
        }) => (
          <Link key={slug} href={`/cooking/${slug}`}>
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
              <div className="flex flex-col items-start  w-3/4 ml-4 p-4 rounded-lg bg-custom-light transition-shadow duration-300 hover:shadow-lg">
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

export const getStaticProps: GetStaticProps<CookingProps> = async () => {
  const posts = await getRecipesByType({
    type: 'cooking',
    fields: ['slug', 'title', 'labels', 'coverImage', 'ingredient'],
  }) as RecipeSummary[];

  const uniqueLabels = [...new Set(posts.flatMap(({ labels }) => labels || []))];
  const nonOthers = uniqueLabels
    .filter((label) => label.toLowerCase() !== 'others')
    .sort();
  const others = uniqueLabels.filter((label) => label.toLowerCase() === 'others');
  const labelList = [All, ...nonOthers, ...others];

  return {
    props: {
      labelList,
      posts,
    },
    revalidate: 60,
  };
};

export default Cooking;
