import React, { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

const client = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
});

const keycloak = new Keycloak({
  realm: 'myrealm',
  url: 'http://127.0.0.1:4000',
  clientId: 'myclient',
});

let initOptions = {
  url: 'http://localhost:4000/',
  realm: 'master',
  clientId: 'react-client',
  onLoad: 'check-sso', // check-sso | login-required
  KeycloakResponseType: 'code',

  // silentCheckSsoRedirectUri: (window.location.origin + "/silent-check-sso.html")
}

let kc = new Keycloak(initOptions);

const useAuth = () => {
  const isRun = useRef(false);
  const [token, setToken] = useState(null);
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;

    if(isLogin){
      kc.init({
        onLoad: initOptions.onLoad,
        KeycloakResponseType: 'code',
        silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", checkLoginIframe: false,
        pkceMethod: 'S256'
      }).then((auth) => {
        if (!auth) {
          window.location.reload();
        } else {
          setLogin(auth)
          console.info("Authenticated");
          console.log('auth', auth)
          console.log('Keycloak', kc)
          kc.onTokenExpired = () => {
            console.log('token expired')
          }
        }
      }, () => {
        console.error("Authenticated Failed");
      });

    }


   

    // keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
    //   if (authenticated) {
    //     console.log('User is authenticated');
    //   } else {
    //     console.log('User is not authenticated');
    //   }
    // }).catch((error) => {
    //   console.error('Keycloak initialization failed', error);
    // });



    // client.init({
    //     onLoad: 'check-sso',
    //     checkLoginIframe: false, // Disables iframe-based checks
    // })
    // .then((res) => {
    // setLogin(res);
    // setToken(client.token);
    // })
    // .catch((error) => {
    //     console.error("Keycloak initialization failed", error);
    // });

  }, []);

  return [isLogin, token];
};

export default useAuth;