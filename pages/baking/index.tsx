import type { GetServerSideProps } from 'next';

const Baking = () => null;

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/recipes',
    permanent: true,
  },
});

export default Baking;
