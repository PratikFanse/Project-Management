import './App.css';
import { Link } from 'react-router-dom';
import Login from '../Authentication/Login/Login'
import { Route, Routes} from 'react-router-dom';
import cookie from 'js-cookie';
function App() {
  const page = () =>{
    if(cookie.get('access_token')){ 
      return <Routes>
        <Route path="/login" exact element={<Login test="test props"/>}/>
      </Routes>
      } else {
        window.history.pushState({},'','/login')
        return <Login/>;
      }
  }
  
  
  return (
    <div className="App">
      <header className="App-header">
        <Link to='/login'>Login</Link> 
        {/* <Login></Login> */}
        {page()}
          {/* <Routes> */}
            {/* <Route path="/" exact element={<App/>} /> */}
            {/* <Route path="/login" exact element={<Login test="test props"/>}/>
          </Routes> */}
      </header>
    </div>
  );
}

export default App;
