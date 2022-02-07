import Sidenav from "./Common/Sidenav/Side.nav";
import { useJwt } from "react-jwt";
import Cookies from "js-cookie";
import * as React from "react";
import Loader from "../Common/loader";
import { useLocation } from "react-router";
const MainRoutes = React.lazy(() => import("./Main.routes"));
const UserActions = React.lazy(() => import("./Common/UserActions/UserActions"));

export default function MainApp(props){
    const currentRoute = useLocation().pathname;
    const user = useJwt(Cookies.get('access_token')).decodedToken;
    const routes = ['/','/home','/people','/projects','/project']
    return(

        <React.Suspense fallback={<Loader/>}>
            {
            routes.includes(currentRoute)?
                <div className="mainApp">
                    <div className='sideNav'><Sidenav userInfo={user}/></div>
                    <MainRoutes userInfo={user}/>
                    <UserActions userInfo={user}/>
                </div>
                :<MainRoutes />
            }
        </React.Suspense>
        )
}