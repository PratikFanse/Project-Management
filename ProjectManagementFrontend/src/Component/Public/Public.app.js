import React, { lazy, Suspense } from "react"
import { Alert, Grid, Slide, Snackbar, Typography } from "@mui/material"
import { useLocation } from "react-router"
import './Public.App.css'
import Loader from "../Common/loader"
const PublicRoutes = lazy(() => import("./Public.routes"))

export default function PublicApp(props){
    const currentRoute = useLocation().pathname
    const publicRoutes=['/login','/signup','/forgotPassword','/resetPassword']
    const [open, setOpen] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);
    const [notifyText, setNotifyText] = React.useState('')
 
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
        <Suspense fallback={<Loader/>}>
            <header className="PublicAppHeader">
                <Grid className='publicScreen' container spacing={2}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>
                        <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h5' component="div">Welcome to</Typography>
                        <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h4' component="div">Project Management System</Typography>
                    </Grid>
                    <Grid item xs={4}>
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
        </Suspense>
    )
}
function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}