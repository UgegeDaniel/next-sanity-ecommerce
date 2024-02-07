// _app.js
import { AppProps } from 'next/app';
import Auth0ProviderWithHistory from './auth/auth0-provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0ProviderWithHistory>
      <Component {...pageProps} />
    </Auth0ProviderWithHistory>
  );
}

export default MyApp;
