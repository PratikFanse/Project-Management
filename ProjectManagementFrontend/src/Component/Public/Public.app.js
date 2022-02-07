import React, { lazy, Suspense } from "react"
import { Alert, Grid, Slide, Snackbar, Typography } from "@mui/material"
import { useLocation } from "react-router"
import './Public.App.css'
import Loader from "../Common/loader"
const PublicRoutes = lazy(() => import("./Public.routes"))

export default function PublicApp(props){
    const currentRoute = useLocation().pathname
    const publicRoutes=['/','/login','/signup','/forgotPassword','/resetPassword'];
    const [open, setOpen] = React.useState(false);
    const [transission, setTransission] = React.useState(undefined);
    const [notifyText, setNotifyText] = React.useState('')
 
    const otpSent = () => {
        setNotifyText('OTP sent successfully!')
        setTransission(() => TransissionUp);
        setOpen(true);
    };

    const passwordChanged = () => {
        setNotifyText('Your password is reset!')
        setTransission(() => TransissionUp);
        setOpen(true);
    };
    return(
        <Suspense fallback={<Loader/>}>
        {
        publicRoutes.includes(currentRoute)?
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
                      TransissionComponent={transission}
                      autoHideDuration={6000}
                      onClose={()=>setOpen(false)}
                      key={transission ? transission.name : ''}>
                        <Alert  onClose={()=>setOpen(false)} severity="success" sx={{ width: '100%' }}>
                            {notifyText}
                        </Alert>
                    </Snackbar>
                </Grid>
            </header>
        :<PublicRoutes notifyOTP={otpSent} passChanged={passwordChanged}/>
        }
        </Suspense>
    )
}
function TransissionUp(props) {
    return <Slide {...props} direction="up" />;
}