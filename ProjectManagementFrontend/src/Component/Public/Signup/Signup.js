import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, FormHelperText, Grid, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import './Signup.css';
import { Link } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from 'moment';
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
axios.defaults.withCredentials = true

export default function Signup(props){
    const [validation, setValidation] = new React.useState({
        isUserName:false,
        isDob:false,
        isEmail:false,
        isStrongPassword:false,
        isAttempted:false,
        isConfirmPassMatch: false,
        isEmailExist:false
    });
    const [helperText, setHelperText] = new React.useState({
        username:"Must have min 3 character.",
        email:"example@email.com",
        password:"Min 1 special, upper & lower case & 8 char's.",
        confPass:"Entered password do not match.",
    });
    const [loginElement,setLoginElement] = new React.useState(null);
    const [dob, setDob] = new React.useState(moment(new Date().setFullYear(new Date().getFullYear()-18)));
    const [pass, setPass] = new React.useState(null);
    const [confPass, setConfPass] = new React.useState(null);
    const [showPassword, setShowPassword] = new React.useState(false)
    const validateCred=(ev)=>{
        const validations = {...validation}
        switch (ev.target.name) {
            case 'username': validations['isUserName'] = validator.isLength(ev.target.value,{min:3})
                break;
            case 'dob': validations['isDob'] = ev.target.value ? true:false;
                break;
            case 'email': validations['isEmail'] = validator.isEmail(ev.target.value)
                break;
            case 'password': {
                    validations['isStrongPassword'] = validator.isStrongPassword(ev.target.value)
                    validations['isConfirmPassMatch'] = validations.isStrongPassword && confPass===ev.target.value
                    setPass(ev.target.value)
                }
                break;
            case 'confirmPass': {
                    validations['isConfirmPassMatch'] = validations.isStrongPassword && ev.target.value===pass
                    setConfPass(ev.target.value)
                }
                break;
            default:
                break;
        }
        setValidation({...validations})
    }
    const signUp =(event)=>{
        event.preventDefault();
        const form = event.target
        if(validation.isUserName && validation.isEmail && validation.isStrongPassword 
            && validation.isConfirmPassMatch && dob){ 
            const newUser = {
                username: form.username.value,
                dob:moment(dob),
                email: form.email.value,
                password: form.password.value
            }
            axios.post('/user/signup',newUser)
                .then(response =>{
                    if(response.data.isCreated){
                        loginElement.click()
                    } else {
                        setHelperText({...helperText,email:response.data.msg})
                        setValidation({...validation,isEmailExist:true,isAttempted:true})
                    }
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
                <Box component="form" autoComplete="off" onSubmit={signUp}>
                    <CardContent>
                        {/* <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h5' component="div">Welcome back</Typography> */}
                        <Typography sx={{mx:1, mb:2}} gutterBottom variant='h5' component="div">Create new account</Typography>
                        <Grid container sx={{ '& .MuiTextField-root': { minWidth: 100}} }>
                        <Grid item xs={6}>
                            <TextField 
                                id="username" 
                                name="username" 
                                size="small" 
                                label="User Name" 
                                variant="standard"
                                helperText={helperText.username}
                                error={validation.isAttempted && !validation.isUserName}
                                onChange={validateCred} required/>
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={DateAdapter}>
                                <DatePicker
                                    id="dob" 
                                    name="dob" 
                                    label="Date of birth" 
                                    value={dob}
                                    maxDate={moment(new Date().setFullYear(new Date().getFullYear()-18))}
                                    onChange={ (value)=>{setDob(value)}}
                                    renderInput={(params) => 
                                        <TextField size="small" variant="standard" {...params}/>} 
                                        required/>
                            </LocalizationProvider>
                        </Grid>
                        </Grid>
                        <div>
                            <TextField 
                                id="email" 
                                name="email" 
                                size="small" 
                                label="Email" 
                                variant="standard"
                                helperText= {helperText.email}
                                error={validation.isAttempted && (!validation.isEmail || validation.isEmailExist)}
                                onChange={validateCred} required/>
                        </div>
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
                                        onMouseDown={handleMouseDownPassword}
                                      >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                onChange={validateCred} 
                                required/>
                                <FormHelperText 
                                error= {validation.isAttempted && !validation.isStrongPassword}>{helperText.password}</FormHelperText>
                        </FormControl>
                        <div>
                            <TextField 
                                type="password"
                                id="confirmPass" 
                                name="confirmPass" 
                                label="Confirm Password" 
                                size="small" 
                                variant="standard"
                                helperText={validation.isAttempted && !validation.isConfirmPassMatch? helperText.confPass:""}
                                error= { validation.isAttempted && !validation.isConfirmPassMatch }
                                onChange={validateCred} 
                                required/>
                        </div>
                    </CardContent>
                    <CardActions sx={{mx:2, mb:2 }}>
                        <Stack direction="row" spacing={2}>
                            <Button type='submit' variant="contained">Sign up</Button>
                            <Link to='/login' ref={input => setLoginElement(input)}><Button variant="text">Log In</Button></Link>  
                        </Stack>
                    </CardActions>
                </Box>
            </Card>
    )
}