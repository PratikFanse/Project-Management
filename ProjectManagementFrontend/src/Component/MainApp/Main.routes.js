import { Route, Routes, useLocation } from 'react-router-dom';
import './Main.css'
import Home from './Home/Home';
import People from './People/people';

export default function MainRoutes(props){
    const currentRoute = useLocation().pathname
    const routes = ['/home','/people']
    return(
        <Routes> 
            <Route path="/home" exact element={<Home  userInfo={props.userInfo}/>}/>
            <Route path="/people" exact element={<People userInfo={props.userInfo}/>}/>
            <Route path="*" element={<Home  userInfo={props.userInfo}/>}> 
                {routes.includes(currentRoute)?'':window.history.pushState({},'','/home')}
            </Route>
        </Routes>
    )
}