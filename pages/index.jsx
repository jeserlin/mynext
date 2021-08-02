import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  const homePage = '/tech';

  useEffect(() => {
    router.push(homePage);
  }, []);

  return null;
};

export default Home;
