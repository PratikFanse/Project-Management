import { Card, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useLocation } from "react-router"
import Login from "./Authentication/Login/Login"
import PublicRoutes from "./Public.routes"
import './Public.App.css'

export default function PublicApp(props){
    const currentRoute = useLocation().pathname
    const publicRoutes=['/login','/signup','/forgotPassword','/resetPassword']
    const defaultComponent = () =>{
        if(!publicRoutes.includes(currentRoute)){
            window.history.pushState({},'','/login')
            return<Login/>
        }
    }
    return(
        <Grid className='publicScreen' container spacing={2}>
            <Grid item xs={1}></Grid>
            <Grid item xs={5}>
                <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h5' component="div">Welcome back to</Typography>
                <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h4' component="div">Project Management System</Typography>
            </Grid>
            <Grid item xs={4}>
                {defaultComponent()}
                <PublicRoutes/>
            </Grid>
            <Grid item xs={2}></Grid>
        </Grid>
    )
}