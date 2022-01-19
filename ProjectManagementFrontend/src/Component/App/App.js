import './App.css';
import cookie from 'js-cookie';
import PublicApp from '../Public/Public.App';
function App() {
  const renderApp = () =>{
    if(cookie.get('access_token')){ } else {
        return <PublicApp/>
      }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        {renderApp()}
      </header>
    </div>
  );
}

export default App;
