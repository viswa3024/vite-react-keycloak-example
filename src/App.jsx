import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Protected from "./components/Protected";
import Public from "./components/Public";

import useAuth from "./hooks/useAuth";

import Keycloak from 'keycloak-js';

let initOptions = {
  url: 'http://localhost:4000/',
  realm: 'master',
  clientId: 'react-client',
  onLoad: 'login-required', // check-sso | login-required
  KeycloakResponseType: 'code',

  // silentCheckSsoRedirectUri: (window.location.origin + "/silent-check-sso.html")
}

let kc = new Keycloak(initOptions);




function App() {

  const isRun = useRef(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [isTokenExpired, setIsTokenExpired] = useState(false);


  useEffect(() => {
    debugger
    if (isRun.current) return;

    isRun.current = true;
    
      debugger
      kc.init({
        onLoad: initOptions.onLoad,
        KeycloakResponseType: 'code',
        silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html", checkLoginIframe: false,
        pkceMethod: 'S256'
      }).then((auth) => {
        if (!auth) {
          window.location.reload();
        } else {
          console.info("Authenticated");
          console.log('auth', auth)
          console.log('Keycloak', kc)
          kc.onTokenExpired = () => {
            console.log('token expired')
          }
        }
      }, () => {
        console.error("Authenticated Failed");
        setIsTokenExpired(true)
      });
    
  }, []);

  return (
    <div className="App">
      {/* <Auth /> */}
      <div className='grid'>
        <div className='col-12'>
          <h1>My Awesome React App</h1>
        </div>
        <div className='col-12'>
          <h1 id='app-header-2'>Secured with Keycloak</h1>
        </div>
      </div>
      <div className="grid">
        <div className="col">
          <button onClick={() => { setInfoMessage(kc.authenticated ? 'Authenticated: TRUE' : 'Authenticated: FALSE') }} className="m-1" label='Is Authenticated' >Is Authenticated</button>         
          <button onClick={() => { kc.login() }} className='m-1' label='Login' severity="success" >Login</button>
          <button onClick={() => { setInfoMessage(kc.token) }} className="m-1" label='Show Access Token' severity="info" >Show Access Token</button>
          <button onClick={() => { setInfoMessage(JSON.stringify(kc.tokenParsed)) }} className="m-1" label='Show Parsed Access token' severity="info" >Show Parsed Access token</button>
          <button onClick={() => { setInfoMessage(kc.isTokenExpired(5).toString()) }} className="m-1" label='Check Token expired' severity="warning" >Check Token expired</button>
          <button onClick={() => { kc.updateToken(10).then((refreshed)=>{ setInfoMessage('Token Refreshed: ' + refreshed.toString()) }, (e)=>{setInfoMessage('Refresh Error')}) }} className="m-1" label='Update Token (if about to expire)' >Update Token (if about to expire)</button>  {/** 10 seconds */}
          <button onClick={() => { kc.logout({ redirectUri: 'http://localhost:5173/' }) }} className="m-1" label='Logout' severity="danger" >Logout</button>
          
        </div>
      </div>

      {/* <div className='grid'>
      <div className='col'>
        <h2>Is authenticated: {kc.authenticated}</h2>
      </div>
        </div> */}


      <div className='grid'>
        <div className='col-2'></div>
        <div className='col-8'>
        <h3>Info Pane</h3>
          <div>
            <p style={{ wordBreak: 'break-all' }} id='infoPanel'>
              {infoMessage}
            </p>
          </div>
        </div>
        <div className='col-2'></div>
      </div>



    </div>
  );
}


export default App;