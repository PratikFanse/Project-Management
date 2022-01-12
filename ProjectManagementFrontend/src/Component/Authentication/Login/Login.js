import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import './Login.css';
import { Route } from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
axios.defaults.withCredentials = true

export default function Login(props){
    const [validation, setValidation] = new React.useState({
        isEmail:true,
        isStrongPassword:false,
        isAttempted:false
    })
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
        if(validation.isEmail){
            const form = event.target 
            const cred = {
                username: form.email.value,
                password: form.password.value
            }
            // axios.get('/user/profile')
            // axios.get('/user/logout')
            axios.post('/user/login',cred)
                .then(response =>{
                    // localStorage.setItem('access_token',response.data.access_token)
                    console.log(response)
                })
        } else{

            const validations = {...validation};
            validations.isAttempted = true;
            setValidation(validations);
        }
    }
    return(
        <Card className="custom-login" sx={{ '& .MuiTextField-root': {align: 'left' ,m:1, minWidth: 275} }}>
            <Box component="form" autoComplete="off" onSubmit={validateUser}>
                <CardContent>
                    <Typography sx={{m:1}} gutterBottom variant='h5' component="div">SignIn</Typography>
                    <div>
                        <TextField 
                            id="email" 
                            name="email" 
                            size="small" 
                            label="Email" 
                            variant="outlined"
                            helperText="example@email.com"
                            error={!validation.isEmail}
                            onChange={validateCred} />
                    </div>
                    <div>
                        <TextField 
                            type="password"
                            id="password" 
                            name="password" 
                            label="Password" 
                            size="small" 
                            variant="outlined"
                            helperText="min 1 special, upper & lower case & 8 char's."
                            error= {validation.isAttempted && !validation.isStrongPassword}
                            onChange={validateCred} 
                            />
                    </div>
                </CardContent>
                <CardActions sx={{mx:2, mb:2 }}>
                    <Stack direction="row" spacing={2}>
                        <Button type='submit' variant="contained">Contained</Button>  
                        <Button variant="text">Sign up</Button>
                    </Stack>
                </CardActions>
            </Box>
        </Card>
    )
}

function validateUser(){

}