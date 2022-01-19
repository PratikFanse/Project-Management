import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, FormHelperText, Grid, Input, IconButton,InputAdornment, InputLabel, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Link, Route, useLocation } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
axios.defaults.withCredentials = true
export default function ResetPassword(){
    const userToken = useLocation().state
    const [loginElement,setLoginElement] = new React.useState(null)
    useEffect(()=>{
        if(!userToken && loginElement)
            loginElement.click()
        },[loginElement])  
    const [validation, setValidation] = new React.useState({
        isStrongPassword:false,
        isAttempted:false,
        isPasswordMatch: false,
        isOTP: false,
        isValidOTP:true
    });
    const [showPassword, setShowPassword] = new React.useState(false);  
    const [inputValues, setInputValues] = new React.useState({
        otp:'',
        password:'',
        confirmPass:''
    });
    const [helperText, setHelperText] = new React.useState({
        password:"Min 1 special, upper & lower case & 8 char's.",
        confPass:"Entered password do not match.",
    });
    const validateInput=(ev)=>{
        console.log(validation)
        const validations = {...validation}
        if(ev.target.name!='otp')
            setInputValues({...inputValues,[ev.target.name]: ev.target.value});
        switch (ev.target.name) {
            case 'password': {
                    validations['isStrongPassword'] = validator.isStrongPassword(ev.target.value)
                    validations['isPasswordMatch'] = validations.isStrongPassword && inputValues.confirmPass===ev.target.value
                }
                break;
            case 'confirmPass': {
                    validations['isPasswordMatch'] = validations.isStrongPassword && ev.target.value===inputValues.password
                }
                break;
            case 'otp':{
                    if(ev.target.value.length<=6){
                        validations['isOTP'] = ev.target.value.match(/^[0-9]{6,6}$/)?true:false;
                        setInputValues({...inputValues,otp: ev.target.value});
                    }
                }
                break;
        }
        setValidation({...validations})
    }
    const resetPassowrd =(event)=>{
        event.preventDefault();
        if(validation.isStrongPassword && validation.isPasswordMatch &&validation.isOTP){
            const form = event.target 
            const newPassword = {
                email: userToken.email,
                userToken: userToken.token,
                otp:form.otp.value,
                newPass: form.password.value
            }
            axios.post('/user/resetPassword',newPassword)
                .then(response =>{
                    if(response.data.isPasswordReset)
                        loginElement.click()
                }).catch( ()=>{
                    setValidation({...validation, isValidOTP:false} );
                })
        } else{
            const validations = {...validation};
            validations.isAttempted = true;
            setValidation(validations);
        }
    }
    const handleMouseDownPassword =(ev)=>{
        ev.preventDefault();
    }
    return(
        <Card className="formModel" sx={{ '& .MuiTextField-root': {align: 'left' ,mx:1, mb:1.5, minWidth: 360} }}>
            <Box component="form" autoComplete="off" onSubmit={resetPassowrd}>
                <CardContent>
                    {/* <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h5' component="div">Welcome back</Typography> */}
                    <Typography sx={{mx:1,mb:1}} gutterBottom variant='h5' component="div">Reset password</Typography>
                    <Typography sx={{mx:1,mb:2}} variant="body2" gutterBottom component="div">
                        OTP is sent to your email address.
                    </Typography>
                    <TextField 
                        id="otp" 
                        name="otp" 
                        label="OTP" 
                        size="small" 
                        variant="standard"
                        value={inputValues.otp}
                        helperText="Enter 6 digit OTP"
                        error= { validation.isAttempted && !validation.isOTP }
                        onChange={validateInput}/>
                    <FormControl sx={{mx:1,mb:1.5, minWidth: 360}} variant='standard'>
                        <InputLabel htmlFor='password' 
                            error= {validation.isAttempted && !validation.isStrongPassword}>Password</InputLabel>
                        <Input 
                            type={showPassword ? 'text':'password'}
                            id="password" 
                            name="password" 
                            label="Password" 
                            variant="standard"
                            error= {validation.isAttempted && !validation.isStrongPassword}
                            endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={()=>setShowPassword(!showPassword)}
                                    onMouseDown={handleMouseDownPassword}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                            onChange={validateInput} 
                            />
                            <FormHelperText 
                            error= {validation.isAttempted && !validation.isStrongPassword}>min 1 special, upper & lower case & 8 char's.</FormHelperText>
                    </FormControl>
                    <TextField 
                        type="password"
                        id="confirmPass" 
                        name="confirmPass" 
                        label="Confirm Password" 
                        size="small" 
                        variant="standard"
                        helperText={validation.isAttempted && !validation.isPasswordMatch? helperText.confPass:""}
                        error= { validation.isAttempted && !validation.isPasswordMatch }
                        onChange={validateInput} 
                        />
                </CardContent>
                        {
                            validation.isValidOTP? 
                            '':<FormHelperText sx={{mx:3}} className='invalidOTPError' error= {true}>
                                Entered OTP is invalid
                                </FormHelperText>
                        }
                <CardActions sx={{mx:2,mb:2}}>
                    <Stack direction="row" spacing={2}>
                        <Button type='submit' variant="contained">Reset Password</Button>
                        <Link to='/login' ref={input => setLoginElement(input)}><Button variant="text">Log In</Button></Link>  
                    </Stack>
                </CardActions>
            </Box>
        </Card>
    )
}