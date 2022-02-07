import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Box, Button, Checkbox, Chip, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Step, StepButton, StepLabel, Stepper, Typography } from "@mui/material";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import validator from "validator";
import axios from "axios";
import moment, { isMoment } from "moment";
import AssignmentIcon from '@mui/icons-material/Assignment';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import './AddOrEditTask.css'

const steps = [
 'todo','inprogress','review','completed'
];


export default function AddOrEditTask(props){
  const [userInfo] = React.useState(props.userInfo);
  const [projectList, setProjectList] = React.useState([]);  
  const [memebrList, setMemberList] = React.useState([]);
  const [isEditTask] = React.useState(props.isEditTask?true:false)
  const [isValidStartDate,setIsValidStartDate] = React.useState(true)
  const [project] = React.useState(props.project?props.project:null)
  const [task, setTask] = React.useState({
    title:'',
    isPersonal:project?false:!isEditTask,
    project:project?project.id:'',
    owner:'',
    startDate:null,
    endDate:null
    });
  const [validations,setValidations] = React.useState({
    title:false,
    dateRange:false,
    project:project?true:false,
    owner:false,
    isAttempted:false,
  });
  React.useEffect(()=>{
    if(isEditTask && props.editTaskPageInfo){
      axios.get('/task/getTaskById/'+props.editTaskPageInfo).then((response)=>{
        if(response.data.projectList){
          setProjectList(response.data.projectList)
          setMemberList(response.data.memberList)
        }
        setTask(response.data)
        setIsValidStartDate(response.data.startDate?false:true)
        setValidations({
          title:true,
          dateRange:true,
          project:response.data.project?true:false,
          owner:response.data.project?true:false,
          isAttempted:false,
        })
      })
    }
  },[isEditTask, props.editTaskPageInfo])
  React.useEffect(()=>{
    if(!task.isPersonal && !task.projectList){
      axios.get('/project/getProjectList').then((res)=>{
        setProjectList(res.data)
      })
    } else {
      if(task.projectList)
        setTask({...task,projectList:''})
      else{
        setTask({...task,project:'none',owner:'none'})
        setMemberList([])
      }
    }
  },[task.isPersonal])
  React.useEffect(()=>{
    if(task.project && task.project!=='none' && !task.memberList){
      axios.get('/project/getProjectMembers/'+task.project).then((res)=>{
        setTask({...task,owner:'none'})
        setMemberList(res.data)
      })
    } else {
      if(task.memberList)
        setTask({...task,memberList:''})
      else{
        setTask({...task,owner:'none'})
        setMemberList([])
      }
    }
  },[task.project])
  const updateValue = (ev) =>{
    if(ev.target.name!=='isPersonal'){
      setTask({...task, [ev.target.name]: ev.target.value})
    } else{
      setTask({...task, [ev.target.name]: ev.target.checked})
    }
    validateForm(ev)
  }
  const validateForm=(ev,dateRange)=>{
    if(dateRange){
      if(isMoment(dateRange[0]) && isMoment(dateRange[1]) &&
        dateRange[0].isSameOrBefore(dateRange[1],'date')){
          if(isValidStartDate && dateRange[0].isSameOrAfter(new Date(),'date'))
            setValidations({...validations,dateRange:true})
          else
            setValidations({...validations,dateRange:false})
        } else {
          setValidations({...validations,dateRange:false})  
        }
    } else{
      if(ev.target.name === 'title'){
        setValidations({...validations, title:validator.isLength(ev.target.value,{min:3})})
      } else if(ev.target.name === 'project' || ev.target.name === 'owner'){
        setValidations({...validations, 
          [ev.target.name]: (!task.isPersonal && ev.target.value!=='none')||task.isPersonal})
      }
    }
  }

  const addTask=(ev)=>{
    ev.preventDefault();
    if(validations.title && validations.dateRange && 
      (task.isPersonal||(!task.isPersonal && task.project!=='none' && task.owner!=='none'))){
        let newTask = {...task}
        if(newTask.project==="none"||!newTask.project){
          delete newTask['project']
          delete newTask['owner']
        }
        axios.post('/task/addNewTask',newTask).then((res)=>{
          props.reRenderTask('')
          props.reRenderTask('allTask')
          props.handleClose()
        })
      } else {
        setValidations({...validations, isAttempted:true})
      }
  }
  const updateTask=(ev)=>{
    ev.preventDefault();
    if(validations.title && validations.dateRange && 
      (task.isPersonal||(!task.isPersonal && task.project!=='none' && task.owner!=='none'))){
        let newTask = {...task}
        if(newTask.project==="none"||!newTask.project){
          delete newTask['project']
          delete newTask['owner']
        }
        axios.post('/task/updateTask',newTask).then((res)=>{
          props.reRenderTask('')
          props.reRenderTask('allTask')
          props.handleClose()
        })
      } else {
        setValidations({...validations, isAttempted:true})
      }
  }
  const changeTransission=(transission)=>{
    axios.put('/task/changeTransission',{transission:transission,taskId:task._id}).then(()=>{
      props.reRenderTask('')
      props.reRenderTask('allTask')
      props.handleClose()
      }
    )
  }
  return(
      <Box component="form" autoComplete="off" onSubmit={isEditTask?updateTask:addTask} sx={style}>
        <Typography sx={{mb:1}} id="modal-modal-title" variant="h6" component="h2">
          {isEditTask?'Edit':'Add'} Task
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField sx={{width:'100%', mb:2}}
              id="filled-textarea"
              value={task.title}
              name="title"
              label="Task Name"
              placeholder="Placeholder"
              variant="standard"
              size="small"
              required
              error={!validations.title && validations.isAttempted}
              helperText="Must have min 3 character."
              onChange={updateValue}
              />
          </Grid>
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DateRangePicker
              disablePast={isValidStartDate}
              value={[task.startDate,task.endDate]}
              // minDate={new Date()}
              onChange={(newValue) => {
                if(!moment(newValue[0]).isSame(task.startDate,'date'))
                  setIsValidStartDate(true)
                newValue[1]
                  ?setTask({...task, startDate:newValue[0]._d, endDate:newValue[1]._d})
                  :setTask({...task, startDate:newValue[0]._d})
                validateForm('',newValue)
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField sx={{ml:2}}  required variant="standard" {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField variant="standard" required {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
          {
            isEditTask || project?''
            :<Grid item sx={{mb:1}} xs={12}>
              <FormControlLabel 
                name="isPersonal"
                control={
                  <Checkbox checked={task.isPersonal}
                    onClick={updateValue}
                />} 
                label="Is this Personal task" 
              />
            </Grid>
          }
          {
            !task.isPersonal?
            <Grid container spacing={2} sx={isEditTask||project?{ml:0,mt:1.5}:{ml:0}}>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ minWidth: '100%', mb:2 }}>
                  <InputLabel id="select-project-label"
                  error={!validations.project && !task.isPersonal && validations.isAttempted}>
                    Project
                  </InputLabel>
                  <Select
                    labelId="select-project-label"
                    name="project"
                    id="demo-simple-select-standard"
                    value={task.project?task.project:'none'}
                    onChange={updateValue}
                    disabled={isEditTask || project?true:false}
                    label="Project"
                    error={!validations.project && !task.isPersonal && validations.isAttempted}
                  >
                    <MenuItem value="none">None</MenuItem>
                    { project?
                      <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>:  
                      projectList.map((project)=>
                        <MenuItem key={project._id} value={project._id}>{project.title}</MenuItem>  
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ minWidth: '100%', mb:2 }}>
                  <InputLabel id="select-owner-label" 
                  error={!validations.owner && !task.isPersonal && validations.isAttempted}>
                    Owner
                  </InputLabel>
                  <Select
                    labelId="select-owner-label"
                    name="owner"
                    id="memberList"
                    value={task.owner?task.owner:'none'}
                    onChange={updateValue}
                    label="Owner"
                    error={!validations.owner && !task.isPersonal && validations.isAttempted}
                  >
                    <MenuItem value="none">None</MenuItem>
                    {
                      memebrList.map((member)=>
                        <MenuItem className="member-li" key={member._id} value={member._id}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>{member.username}</Grid>
                            <Grid item sx={{textAlign:'right'}} xs={6}>
                              <Chip
                                  sx={{textTransform: "uppercase"}}
                                  label={member.role}
                                  size="small"/>
                            </Grid>
                          </Grid>
                          </MenuItem>  
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            :''
          }
          <Grid item xs={12}>
            <TextField sx={{width:'100%'}}
            name="description"
            value={task.description?task.description:''}
            id="filled-textarea"
            label="Description"
            placeholder="Description"
            multiline
            variant="filled"
            rows={2}
            onChange={updateValue}
            />
          </Grid>
          {
            isEditTask && (userInfo.role!=='employee' || (userInfo.role==='employee' && task.isPersonal))
              ?<Box sx={{ width: '100%', my: 4 }}>
                <Stepper nonLinear activeStep={steps.indexOf(task.transission)} alternativeLabel >
                    <Step key='TODO' active={steps.indexOf(task.transission)===0} >
                      <StepButton color="inherit" onClick={()=>changeTransission('todo')}>
                        <StepLabel className={steps.indexOf(task.transission)===0?'activeStep':''} StepIconComponent={()=><AssignmentIcon/>}>TODO</StepLabel>
                      </StepButton>
                    </Step>
                    <Step key='INPROGRESS' active={steps.indexOf(task.transission)===1}>
                      <StepButton color="inherit" onClick={()=>changeTransission('inprogress')}>
                        <StepLabel className={steps.indexOf(task.transission)===1?'activeStep':''} StepIconComponent={()=><ModelTrainingIcon/>}>INPROGRESS</StepLabel>
                      </StepButton>
                    </Step>
                    <Step key='RREVIEW' active={steps.indexOf(task.transission)===2}>
                      <StepButton color="inherit" onClick={()=>changeTransission('review')}>
                        <StepLabel className={steps.indexOf(task.transission)===2?'activeStep':''} StepIconComponent={()=><ManageSearchIcon/>}>REVIEW</StepLabel>
                      </StepButton>
                    </Step>
                    <Step key='COMPLETED' active={steps.indexOf(task.transission)===3}>
                      <StepButton disabled={false} color="inherit" onClick={()=>changeTransission('completed')}>
                        <StepLabel className={steps.indexOf(task.transission)===3?'activeStep':''} StepIconComponent={()=><CheckCircleOutlineRoundedIcon/>}>COMPLETED</StepLabel>
                      </StepButton>
                    </Step>
                </Stepper>
              </Box>
              :""
          }
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button type='submit' variant="contained">{isEditTask?'Update':'Add'}</Button>
              <Button variant="outlined" onClick={props.handleClose}>Cancel</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  borderRadius: '10px',
  boxShadow: '3px 3px 10px #434242bd',
  p: 4,
};