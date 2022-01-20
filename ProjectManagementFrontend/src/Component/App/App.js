import './App.css';
import cookie from 'js-cookie';
import PublicApp from '../Public/Public.App';
import MainApp from '../MainApp/Main.App';
function App() {
  const renderApp = () =>{
    if(cookie.get('access_token')){
        return<MainApp/>
     } else {
        return <PublicApp/>
      }
  }
  
  return (
    <div className="App">
        {renderApp()}
    </div>
  );
}

export default App;
