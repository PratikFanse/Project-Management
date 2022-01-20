import { Alert, Card, Grid, Slide, Snackbar, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useLocation } from "react-router"
import Login from "./Authentication/Login/Login"
import PublicRoutes from "./Public.routes"
import './Public.App.css'
import React from "react"

export default function PublicApp(props){
    const currentRoute = useLocation().pathname
    const publicRoutes=['/login','/signup','/forgotPassword','/resetPassword']
    const [open, setOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const [notifyText, setNotifyText] = React.useState('')
    const defaultComponent = () =>{
        if(!publicRoutes.includes(currentRoute)){
            window.history.pushState({},'','/login')
            return<Login/>
        }
    }
    const otpSent = () => {
        setNotifyText('OTP sent successfully!')
        setTransition(() => TransitionUp);
        setOpen(true);
    };

    const passwordChanged = () => {
        setNotifyText('Your password is reset!')
        setTransition(() => TransitionUp);
        setOpen(true);
    };
    return(
        <header className="PublicAppHeader">
            <Grid className='publicScreen' container spacing={2}>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                    <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h5' component="div">Welcome to</Typography>
                    <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h4' component="div">Project Management System</Typography>
                </Grid>
                <Grid item xs={4}>
                    {defaultComponent()}
                    <PublicRoutes notifyOTP={otpSent} passChanged={passwordChanged}/>
                </Grid>
                <Grid item xs={2}></Grid>
                <Snackbar
                  open={open}
                  TransitionComponent={transition}
                  autoHideDuration={6000}
                  onClose={()=>setOpen(false)}
                  key={transition ? transition.name : ''}>
                    <Alert  onClose={()=>setOpen(false)} severity="success" sx={{ width: '100%' }}>
                        {notifyText}
                    </Alert>
                </Snackbar>
            </Grid>
        </header>
    )
}
function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}