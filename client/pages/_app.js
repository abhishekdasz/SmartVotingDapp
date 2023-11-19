import '@/styles/globals.css';
import { AccountProvider } from './context/AccountProvider';


function MyApp({ Component, pageProps }) {
  return (
    <AccountProvider>
      <Component {...pageProps} />
    </AccountProvider>
  );
}

export default MyApp;
