import './App.css';
import cookie from 'js-cookie';
import PublicApp from '../Public/Public.app';
import MainApp from '../MainApp/Main.app';
import React from 'react';
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
    <div className="App">
      {renderApp}
    </div>
  );
}

export default App;
