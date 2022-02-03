import React, { lazy, Suspense } from "react";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import './Home.css';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Box from "@mui/system/Box";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
import EditIcon from '@mui/icons-material/Edit'
import axios from "axios";
import moment from "moment";
import Loader from "../../Common/loader";
import { Switch } from "@mui/material";
const AddOrEditTask = lazy(() => import("../Common/AddOrEditTask/AddOrEditTask"));

export default function Home(props){
    const [open, setOpen] = React.useState(false);
    const [isEditTaskPage,setIsEditTaskPage] = React.useState(false)
    const [editTaskPageInfo,setEditTaskPageInfo] = React.useState('')
    const [isPersonal, setIsPersonal] = React.useState(false);
    const handleClose = () => setOpen(false); 
    const [taskList, setTaskList] = React.useState([]);
    const [taskCategory, setTaskCategory] = React.useState('allTask')
    const fetchTaskList =(taskListType)=>{
      if(taskListType==='isPersonal' || taskListType==='allTask'){
        if(!isPersonal)
          setTaskCategory('isPersonal')
        else if(isPersonal) 
          setTaskCategory('allTask')
      } else
        setTaskCategory(taskListType)
    }
    const togglePersonalTask = () =>{
      setIsPersonal(!isPersonal)
    }
    const handleOpen = (isEdit,editTaskId) => {
      setEditTaskPageInfo(editTaskId?editTaskId:'');
      setIsEditTaskPage(isEdit)
      setOpen(true);
    }
    React.useEffect(()=>{
      if(taskCategory==='allTask')
        axios.get('/task/getAllTask').then((response)=>{
          setTaskList(response.data)
        })
      else if(taskCategory)
        axios.get('/task/getTaskListByCategory/'+taskCategory).then((response)=>{
          setTaskList(response.data)
        })
    },[taskCategory])
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
          <Grid className="todoList" item xs={12}>
            <Grid className="taskCategory" item container xs={12}>
                <Grid className={taskCategory==="allTask" || taskCategory==="isPersonal"?"activeTaskList":""} onClick={()=>fetchTaskList('allTask')} item xs={2}>
                    <h2>{isPersonal?'Personal':'All task'} <Switch checked={!isPersonal} onClick={()=>togglePersonalTask()} size="small" /></h2>
                </Grid>
                <Grid className={taskCategory==="todo"?"activeTaskList":""} onClick={()=>fetchTaskList('todo')} item xs={2}>
                    <h2>ToDo</h2>
                </Grid>
                <Grid className={taskCategory==="inprogress"?"activeTaskList":""} onClick={()=>fetchTaskList('inprogress')} item xs={2}>
                    <h2>Progress</h2>
                </Grid>
                <Grid className={taskCategory==="pending"?"activeTaskList":""} onClick={()=>fetchTaskList('pending')} item xs={2}>
                    <h2>Pending</h2>
                </Grid>
                <Grid className={taskCategory==="pending"?"activeTaskList":""} onClick={()=>fetchTaskList('pending')} item xs={2}>
                    <h2>Review</h2>
                </Grid>
                <Grid className={taskCategory==="pending"?"activeTaskList":""} onClick={()=>fetchTaskList('pending')} item xs={2}>
                    <h2>Completed</h2>
                </Grid>
            </Grid>
            <Grid className="taskList" item xs={12}>
                {
                  taskList.map((task)=>(
                    <ListItem key={task._id}
                      secondaryAction={
                        <Tooltip title="Next Transition" placement="top">
                          <IconButton sx={{mr:1}} edge="end" label='test' aria-label="Transition">
                            <PublishedWithChangesIcon/>
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <Tooltip title="Edit Task" placement="top">
                        <ListItemButton className="itemButton" onClick={()=>handleOpen(true, task._id)} sx={{pl:1,mr:"0"}}>
                          <ListItemIcon sx={{minWidth:"40px"}}>
                            <EditIcon/>
                          </ListItemIcon>
                          <ListItemText primary={task.title}/>
                          {
                            moment(task.endDate).isBefore(moment(),'date')?
                              <ListItemText className="taskState">
                                <Chip
                                sx={{textTransform: "uppercase"}}
                                className="pending"
                                label='Pending'
                                size="small"/>
                              </ListItemText>
                              :''
                          } 
                          <ListItemText className="taskState">
                            <Chip
                              sx={{textTransform: "uppercase"}}
                              className={task.transission}
                              label={task.transission}
                              size="small"/>
                          </ListItemText>                                                                                
                        </ListItemButton>
                      </Tooltip>
                        
                    </ListItem>
                  ))
                }
              </Grid>
            </Grid>
          <Modal
            open={open}
            onClose={handleClose}
            >
              <Box>
                <AddOrEditTask isEditTask={isEditTaskPage} editTaskPageInfo={editTaskPageInfo} reRenderTask={setTaskCategory} handleClose={handleClose}/>
              </Box>
          </Modal>
        </Grid>
      </Suspense>
    ) 
}