import type { GetServerSideProps } from 'next';

const Cooking = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/recipes',
    permanent: true,
  },
});

export default Cooking;
