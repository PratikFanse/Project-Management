import React, { lazy, Suspense } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import './Home.css';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Loader from "../../Common/loader";
const Tasks = lazy(()=> import("../Common/Tasks/Tasks"))
export default function Home(props){
  let handleOpen;
  const getDataFromTasks=(openAddTask)=>{
    handleOpen = openAddTask;
  }
    return(
      <Suspense fallback={<Loader/>}>
        <Grid container spacing={2}>
            <Grid className="mainAppHeader" item xs={12}><h1>Home</h1></Grid>
            <Grid className="mainAppHeader" item container xs={12}>
                <Grid item xs={6}><h3>Welcome {props.userInfo.username}</h3></Grid>
                <Grid item xs={6} sx={{textAlign:'right',mt:'10px',pr:'20px'}}>
                    <Button variant="contained" onClick={()=>handleOpen(false)}><AddRoundedIcon/>Add Task </Button>
                </Grid>  
            </Grid>
          <Tasks setDataToHome={getDataFromTasks} {...props}/>
        </Grid>
      </Suspense>
    ) 
}