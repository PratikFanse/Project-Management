import Sidenav from "./Common/Sidenav/Side.nav";
import MainRoutes from "./Main.routes";

export default function MainApp(props){
    return(
        <div className="mainApp">
            <div className='sideNav'><Sidenav/></div>
            <MainRoutes/>
        </div>
        )
}