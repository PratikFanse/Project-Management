import { Button, Card, CardActions, CardContent, CircularProgress, FormHelperText, Stack, TextField, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { Box } from "@mui/system";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import validator from "validator";

export default function ForgotPassword(props){
    const [validation, setValidation] = new React.useState({
        isEmail:false,
        isAttempted:false,
        isEmailExist: true,
    })
    const [userToken,setUserToken] = new React.useState({
        email:'',
        token:''
    })
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [resetElement, setResetElement] = React.useState();
    const buttonSx = {
        ...(success && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[700],
          },
        }),
      };
    const validateEmail=(ev)=>{
        setValidation({...validation, isEmail:validator.isEmail(ev.target.value)})
    }
    const sendOTP =(event)=>{
        event.preventDefault();
        if(validation.isEmail && !loading){
                setSuccess(false);
                setLoading(true);
            const form = event.target 
            axios.post('/user/forgotPassword',{email:form.email.value})
                .then(response =>{
                    setSuccess(true);
                    setLoading(false);
                    props.notification()
                    setUserToken({email:form.email.value,token: response.data})
                    // navigate('/login')
                    resetElement.click()
                }).catch( (err)=>{
                    setLoading(false);
                    setValidation({...validation, isEmailExist:false} );
                })
        } else{
            setValidation({...validation, isAttempted:true});
        }
    }
    return(
        <Card className="formModel" sx={{ '& .MuiTextField-root': {align: 'left' ,mx:1, mb:1.5, minWidth: 360} }}>
            <Box component="form" autoComplete="off" onSubmit={sendOTP}>
                <CardContent>
                    {/* <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h5' component="div">Welcome back</Typography> */}
                    <Typography sx={{mx:1,mb:1}} gutterBottom variant='h5' component="div">Forgot password</Typography>
                    <Typography sx={{mx:1,mb:2}} variant="body2" gutterBottom component="div">
                        Enter any email you've used before and we'll send you OTP to reset password.
                    </Typography>
                    <div>
                        <TextField 
                            id="email" 
                            name="email" 
                            size="small" 
                            label="Email" 
                            variant="standard"
                            helperText="example@email.com"
                            error={validation.isAttempted && !validation.isEmail}
                            onChange={validateEmail} />
                    </div>
                </CardContent>
                {
                    validation.isEmailExist? 
                    '':<FormHelperText sx={{mx:3}} error= {true}>
                        We couldn't find an account with this email address.
                        </FormHelperText>
                }
                <Typography sx={{mx:3}} variant="body2" gutterBottom component="div">
                        <b>Note:</b> Once OTP is sent do not refresh the page.
                    </Typography>
                <CardActions sx={{mx:2,mb:2}}>
                    <Stack direction="row" spacing={2}>
                        <Button type='submit' 
                            sx={buttonSx}
                            disabled={loading} 
                            variant="contained">
                                Send OTP
                        </Button>
                        {loading && (
                          <CircularProgress
                            size={24}
                            className="buttonLoader"
                            sx={{
                              color: green[500],
                              position: 'absolute'
                            }}
                          />
                        )} 
                        <Link to='/login'><Button variant="text">Back to Login In</Button></Link>  
                        <Link to='/resetPassword' style={{display:'none'}} state={userToken} ref={input => setResetElement(input)}><Button variant="text">Back to Login In</Button></Link>
                    </Stack>
                </CardActions>
            </Box>
        </Card>
    )
}