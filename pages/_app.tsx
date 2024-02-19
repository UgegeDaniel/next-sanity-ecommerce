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
import { Router, Routes, Route } from "react-router";
import CheckoutPage from "../components/Checkout/checkoutPage";
import { userInfo } from "os";
//import Productcheckout from "./productcheckout";

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
          clientId: "oFnaaPG0oZkPf0UltTG68WsU20gcFJhx",
          clientSecret: "GvOkiZ2zuDX5fuvp4UHbeamTYzapj2B6KY3tctI8HzM6weCCKUbdegg8wUezF-rl",
          domain: "dev-2t4071c7y43t7pmj.us.auth0.com",
          redirectUri: "https://next-sanity-ecommerce-sage.vercel.app/profile", // Specify your redirect URI here
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
