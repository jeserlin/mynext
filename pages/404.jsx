import React from 'react';
import Image from 'next/image';

const NotFound = () => (
  <div className="h-full flex flex-col items-center justify-center">
    <Image
      alt="404"
      src="/assets/others/myBunnies.png"
      width={200}
      height={200}
      style={{
        maxWidth: 200,
        height: 200,
      }}
    />
    <h1 className="text-xl font-semibold text-secondary mt-8">
      Oops, page not found
    </h1>
    <p className="text-gray-500">
      But we have some cute bunnies for you, enjoy ~ !
    </p>
  </div>
);

export default NotFound;
