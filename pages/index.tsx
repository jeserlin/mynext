import type { GetServerSideProps } from 'next';

const Home = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/tech',
    permanent: false,
  },
});

export default Home;
