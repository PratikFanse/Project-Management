import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../Public/Authentication/Login/Login'
import Signup from '../Public/Signup/Signup'
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './ResetPassword/ResetPassword';
export default function PublicRoutes(props){
    return(
        <Routes> 
            <Route path="/login" exact element={<Login/>}/>
            <Route path="/signup" exact element={<Signup/>}/>
            <Route path="/forgotPassword" exact element={<ForgotPassword  notification={props.notifyOTP}/>}/>
            <Route path="/resetPassword" exact element={<ResetPassword notification={props.passChanged}/>}/>
        </Routes>
    )
}