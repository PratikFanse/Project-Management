import React from "react";
import { Button, Chip, Grid, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Modal, Tooltip } from "@mui/material";
import './Home.css';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box } from "@mui/system";
import AddOrEditTask from "../Common/AddOrEditTask/AddOrEditTask";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges'
import EditIcon from '@mui/icons-material/Edit'
import axios from "axios";
import moment from "moment";

export default function Home(props){
    const [open, setOpen] = React.useState(false);
    const [isEditTaskPage,setIsEditTaskPage] = React.useState(false)
    const [editTaskPageInfo,setEditTaskPageInfo] = React.useState('')
    const handleOpen = (isEdit,editTaskId) => {
      setEditTaskPageInfo(editTaskId?editTaskId:'');
      setIsEditTaskPage(isEdit)
      setOpen(true);
    }
    const handleClose = () => setOpen(false); 
    const [taskList, setTaskList] = React.useState([]);
    const [taskCategory, setTaskCategory] = React.useState('allTask')
    const fetchTaskList =(taskListType)=>{
      setTaskCategory(taskListType)
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
        <Grid container spacing={2}>
            <Grid className="mainAppHeader" item xs={12}><h1>Home</h1></Grid>
            <Grid className="mainAppHeader" item container xs={12}>
                <Grid item xs={6}><h3>Welcome userName</h3></Grid>
                <Grid item xs={6} sx={{textAlign:'right',mt:'10px',pr:'20px'}}>
                    <Button variant="contained" onClick={()=>handleOpen(false)}><AddRoundedIcon/>Add Task </Button>
                </Grid>  
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Grid className="todoList" item xs={12}>
                            <Grid className="taskCategory" item container xs={12}>
                                <Grid className={taskCategory==="allTask"?"activeTaskList":""} onClick={()=>fetchTaskList('allTask')} item xs={3}>
                                    <h2>All task</h2>
                                </Grid>
                                <Grid className={taskCategory==="todo"?"activeTaskList":""} onClick={()=>fetchTaskList('todo')} item xs={3}>
                                    <h2>ToDo</h2>
                                </Grid>
                                <Grid className={taskCategory==="inprogress"?"activeTaskList":""} onClick={()=>fetchTaskList('inprogress')} item xs={3}>
                                    <h2>Progress</h2>
                                </Grid>
                                <Grid className={taskCategory==="pending"?"activeTaskList":""} onClick={()=>fetchTaskList('pending')} item xs={3}>
                                    <h2>Pending</h2>
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
                            {/* <div className="addTask">
                                <IconButton color="primary" aria-label="add to shopping cart">
                                    <Avatar><AddRoundedIcon /></Avatar>
                                </IconButton>
                            </div> */}
                        </Grid>
                    </Grid>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      // aria-labelledby="modal-modal-title"
                      // aria-describedby="modal-modal-description"
                      >
                        <Box>
                          <AddOrEditTask isEditTask={isEditTaskPage} editTaskPageInfo={editTaskPageInfo} reRenderTask={setTaskCategory} handleClose={handleClose}/>
                        </Box>
                    </Modal>
                </Grid>
            </Grid>
        </Grid>
        ) 
}