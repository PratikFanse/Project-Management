import { lazy, Suspense, useEffect, useState } from "react";
import { Box, Button, Grid, Modal } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded"
import axios from "axios";
import { useLocation } from "react-router";
import EditIcon from '@mui/icons-material/Edit';
const AddOrEditProject = lazy(()=> import("./AddOrEditProject"));
const Tasks = lazy(()=>import("../../Common/Tasks/Tasks"));
const Loader = lazy(()=>import("../../../Common/loader"));

export default function Project(props){
    const [userInfo] = useState(props.userInfo?props.userInfo:null)
    const projectId = useLocation().state.id
    const [project, setProject]=useState(null);
    const [open,setOpen]=useState(false)
    useEffect(()=>{
        axios.get('/project/getProject/'+projectId).then((res)=>{
            setProject(res.data)
        })
    },[projectId])
    const handleClose = () => setOpen(false);
    const [handleOpen, setHandleOpen]=useState(null);
    const getDataFromTasks=(openAddTask)=>{
      setHandleOpen({open:openAddTask});
    }
    return(
        <Suspense fallback={<Loader/>}>
            {project?
            <Grid container spacing={2}>
                <Grid className="mainAppHeader" item xs={12}><h1>{project.title}</h1></Grid>
                <Grid className="mainAppHeader" item container xs={12}>
                    <Grid item xs={6}><h3>Welcome {props.userInfo.username}</h3></Grid>
                    <Grid item xs={6} sx={{textAlign:'right',mt:'10px',pr:'20px'}}>
                        {userInfo && userInfo.role ==='admin'
                        ?<Button variant="contained" onClick={()=>setOpen(true)} sx={{mr:2}}><EditIcon/>Edit Project</Button>
                        :''}
                        <Button variant="contained" onClick={()=>handleOpen.open(false)}><AddRoundedIcon/>Add Task </Button>
                    </Grid>  
                    <Modal
                      open={open}
                      onClose={handleClose}
                      // aria-labelledby="modal-modal-title"
                      // aria-describedby="modal-modal-description"
                      >
                        <Box>
                          <AddOrEditProject isEditProject={true} editProjectPageInfo={projectId} handleClose={handleClose}/>
                        </Box>
                    </Modal>
                </Grid>
                <Tasks setDataToHome={getDataFromTasks} project={{id:project._id,title:project.title}} {...props}/>
            </Grid>:''
            }
        </Suspense>
    )
}