const Home = () => null;

export const getServerSideProps = () => ({
  redirect: {
    destination: '/tech',
    permanent: false,
  },
});

export default Home;
