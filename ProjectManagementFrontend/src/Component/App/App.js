import './App.css';
import cookie from 'js-cookie';
import * as React from 'react';
import Loader from '../Common/loader';
import * as Sentry from "@sentry/react";
const PublicApp = React.lazy(() => import('../Public/Public.app'));
const MainApp = React.lazy(() => import('../MainApp/Main.app'));
function App() {
    const [renderApp, setRenderApp] = React.useState(null)
    React.useEffect(()=>{
      if(cookie.get('access_token')){
        setRenderApp(<MainApp/>)
     } else {
        setRenderApp(<PublicApp/>)
      }
    },[])
  
  return (

    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>            
    <React.Suspense fallback={<Loader/>}>
        <div className="App">
          {renderApp}
        </div>
    </React.Suspense>
    </Sentry.ErrorBoundary>
  );
}

export default Sentry.withProfiler(App);
