import Sidenav from "./Common/Sidenav/Side.nav";
import { useJwt } from "react-jwt";
import Cookies from "js-cookie";
import * as React from "react";
import Loader from "../Common/loader";
const MainRoutes = React.lazy(() => import("./Main.routes"));
const UserActions = React.lazy(() => import("./Common/UserActions/UserActions"));

export default function MainApp(props){
    const user = useJwt(Cookies.get('access_token')).decodedToken
    return(

        <React.Suspense fallback={<Loader/>}>
            <div className="mainApp">
                <div className='sideNav'><Sidenav userInfo={user}/></div>
                <MainRoutes userInfo={user}/>
                <UserActions userInfo={user}/>
            </div>
        </React.Suspense>
        )
}