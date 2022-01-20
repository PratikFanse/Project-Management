import { Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
export default function MainRoutes(props){
    return(
        <Routes> 
            <Route path="/home" exact element={<Home/>}/>
        </Routes>
    )
}