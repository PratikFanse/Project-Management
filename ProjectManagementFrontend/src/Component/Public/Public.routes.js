import * as React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from '../Common/loader';
const Login = React.lazy(()=> import('../Public/Authentication/Login/Login'))
const Signup = React.lazy(()=> import('../Public/Signup/Signup'));
const ForgotPassword = React.lazy(()=> import('./ForgotPassword/ForgotPassword'));
const ResetPassword = React.lazy(()=> import('./ResetPassword/ResetPassword'));
export default function PublicRoutes(props){
    const currentRoute = useLocation().pathname
    const routes = ['/login','/signup','/forgotPassword','/resetPassword']
    return(
        <React.Suspense fallback={<Loader/>}>
            <Routes> 
                <Route path="/login" exact element={<Login/>}/>
                <Route path="/signup" exact element={<Signup/>}/>
                <Route path="/forgotPassword" exact element={<ForgotPassword  notification={props.notifyOTP}/>}/>
                <Route path="/resetPassword" exact element={<ResetPassword notification={props.passChanged}/>}/>
                <Route path="*" exact element={<Login/>}>
                    {routes.includes(currentRoute)?'':window.history.pushState({},'','/login')}
                </Route>
            </Routes>
        </React.Suspense>   
    )
}