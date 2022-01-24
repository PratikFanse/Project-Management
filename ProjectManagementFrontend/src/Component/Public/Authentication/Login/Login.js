import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormControl, FormHelperText, Grid, Input, IconButton,InputAdornment, InputLabel, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import './Login.css';
import { Link, Route } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
axios.defaults.withCredentials = true

export default function Login(props){
    const [validation, setValidation] = new React.useState({
        isEmail:false,
        isStrongPassword:false,
        isAttempted:false,
        isValidCred: true,
    })
    const [showPassword, setShowPassword] = new React.useState(false)
    const validateCred=(ev)=>{
        const validations = {...validation}
        switch (ev.target.name) {
            case "email": validations['isEmail'] = validator.isEmail(ev.target.value)
                break;
            case 'password': validations['isStrongPassword'] = validator.isStrongPassword(ev.target.value)
                break;
            default:
                break;
        }
        setValidation({...validations})
    }
    const validateUser =(event)=>{
        event.preventDefault();
        if(validation.isEmail, validation.isStrongPassword){
            const form = event.target 
            const cred = {
                email: form.email.value,
                password: form.password.value
            }
            // axios.get('/user/profile')
            // axios.get('/user/logout')
            axios.post('/user/login',cred)
                .then(response =>{
                    window.location.reload();
                }).catch( ()=>{
                    // const validations = {...validation};
                    // validations.isValidCred = false;
                    setValidation({...validation, isValidCred:false} );
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
                <Box component="form" autoComplete="off" onSubmit={validateUser}>
                    <CardContent>
                        {/* <Typography sx={{mx:1, mt:1, mb:0}} gutterBottom variant='h5' component="div">Welcome back</Typography> */}
                        <Typography sx={{mx:1,mb:2}} gutterBottom variant='h5' component="div">Log in</Typography>
                        <div>
                            <TextField 
                                id="email" 
                                name="email" 
                                size="small" 
                                label="Email" 
                                variant="standard"
                                helperText="example@email.com"
                                error={validation.isAttempted && !validation.isEmail}
                                onChange={validateCred} />
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
                                />
                                <FormHelperText 
                                error= {validation.isAttempted && !validation.isStrongPassword}>min 1 special, upper & lower case & 8 char's.</FormHelperText>
                        </FormControl>
                    </CardContent>
                    {
                        validation.isValidCred? 
                        '':<FormHelperText sx={{mx:3}} className='loginError' error= {!validation.isValidCred}>
                            We couldn't find an account with this email address and password
                            </FormHelperText>
                    }
                    <CardActions sx={{mx:2}}>
                        <Stack direction="row" spacing={2}>
                            <Button type='submit' variant="contained">Log In</Button> 
                        </Stack>
                    </CardActions>
                    <div className='otherAction'>
                        <Link to='/forgotPassword'>
                            Forgot Password?
                        </Link> 
                        &#160;or&#160;
                        <Link to='/signup'>Sign up</Link> 
                    </div>
                </Box>
            </Card>
    )
}