import { Button } from '@mui/material'
import { useNavigate } from 'react-router';
import image404 from './404.webp'
export default function Page404(){
    const navigate = useNavigate()
    const goToRootUrl=(ev)=>{
        ev.preventDefault();
        navigate('/')
    }
    return(
        <div style={{textAlign:'center',background: '#f2f2f2',height: '100vh'}}>
            <img style={{margin:'auto'}} src={image404}/><br/>
            <Button variant="contained" onClick={goToRootUrl}>GO BACK</Button>
        </div>
    )
}