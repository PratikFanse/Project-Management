import { Route, Routes, useNavigate } from 'react-router-dom';
import './Main.css'
import Home from './Home/Home';

export default function MainRoutes(props){
    const navigate = useNavigate();
    return(
        <Routes> 
            <Route path="/home" exact element={<Home/>}/>
            <Route path="*" exact element={<Home/>}> 
                {window.history.pushState({},'','/home')}
            </Route>
        </Routes>
    )
}