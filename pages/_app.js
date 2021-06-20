import MainLayout from '../layouts/MainLayout';
import { ThemeProvider } from '@material-ui/styles';

import '../styles/globals.css';
import theme from '../theme';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ThemeProvider>
  );
}

export default MyApp;
