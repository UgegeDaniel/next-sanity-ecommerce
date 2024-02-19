import { UserProvider } from "@auth0/nextjs-auth0";
import type { AppProps } from "next/app";
import Footer from "../components/footer/footer";
import { GlobalStyle } from "../GlobalStyles";
import { ShoppingCartProvider } from "../context/shoppingCart";
import Navbar from "../components/navbar/navbar";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";
import { SanityUIDProvider } from "../context/sanityUserId";
import { useRouter } from "next/router";
import "../global.css";
import { ShippingDataProvider } from "../context/shippingContext";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideFooterOnCheckout = router.pathname == "/Itemcheckout";
  const hideOnAddressbook = router.pathname == "/Addressbook";

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PCK8Q8M');
            `}
      </Script>
      <UserProvider
        auth0={{
          clientId: "YOUR_AUTH0_CLIENT_ID",
          clientSecret: "YOUR_AUTH0_CLIENT_SECRET",
          domain: "YOUR_AUTH0_DOMAIN",
          redirectUri: "YOUR_REDIRECT_URI",
          // Add other Auth0 configuration options if needed
        }}
      >
        <SanityUIDProvider>
          <ShippingDataProvider>
            <ShoppingCartProvider>
              <main
                style={{
                  paddingBottom: "15vmin",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <AnimatePresence>
                  <Component {...pageProps} key={router.pathname} />
                </AnimatePresence>
              </main>
              {!hideFooterOnCheckout && <Footer />}{" "}
              {/* COnditionally render the footer */}
              {/* {!hideOnAddressbook && <CheckoutPage  />} */}
              <GlobalStyle />
            </ShoppingCartProvider>
          </ShippingDataProvider>
        </SanityUIDProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
