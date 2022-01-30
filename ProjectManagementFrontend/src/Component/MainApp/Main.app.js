import Sidenav from "./Common/Sidenav/Side.nav";
import MainRoutes from "./Main.routes";
import { useJwt } from "react-jwt";
import Cookies from "js-cookie";

export default function MainApp(props){
    const user = useJwt(Cookies.get('access_token')).decodedToken
    console.log(user)
    return(
        <div className="mainApp">
            <div className='sideNav'><Sidenav userInfo={user}/></div>
            <MainRoutes userInfo={user}/>
        </div>
        )
}