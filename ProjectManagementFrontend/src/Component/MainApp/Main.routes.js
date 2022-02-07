import { Route, Routes, useLocation } from 'react-router-dom';
import './Main.css'
import * as React from 'react';
import Loader from '../Common/loader';
const Project = React.lazy(()=> import('./Projects/Project/Project'));
const Projects = React.lazy(()=> import('./Projects/Projects'));
const Home = React.lazy(() => import('./Home/Home'));
const People = React.lazy(() => import('./People/people'));

export default function MainRoutes(props){
    const currentRoute = useLocation().pathname
    const routes = ['/home','/people','/projects','/project']
    return(

        <React.Suspense fallback={<Loader/>}>
            <Routes> 
                <Route path="/home" exact element={<Home  userInfo={props.userInfo}/>}/>
                <Route path="/people" exact element={<People userInfo={props.userInfo}/>}/>
                <Route path="/projects" exact element={<Projects userInfo={props.userInfo}/>}/>
                <Route path="/project" exact element={<Project userInfo={props.userInfo}/>}/>
                <Route path="*" element={<Home  userInfo={props.userInfo}/>}> 
                    {routes.includes(currentRoute)?'':window.history.pushState({},'','/home')}
                </Route>
            </Routes>
        </React.Suspense>
    )
}