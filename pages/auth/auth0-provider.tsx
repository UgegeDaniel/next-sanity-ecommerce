// auth0-provider.js
import { Auth0Provider } from "@auth0/auth0-react";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "./auth0-config";
import Profile from "../components/profile";
import { useEffect, useState } from "react";

const Auth0ProviderWithHistory = ({ children }: { children: JSX.Element }) => {
  const [redirectUri, setRedirectUri] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRedirectUri(window.location.origin);
    }
  }, []);

  return redirectUri ? (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      <Profile />
    </Auth0Provider>
  ) : null;
};

export default Auth0ProviderWithHistory;
