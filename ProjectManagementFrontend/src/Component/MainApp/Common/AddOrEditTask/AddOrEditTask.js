import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Step, StepButton, StepLabel, Stepper, Typography } from "@mui/material";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import validator from "validator";
import axios from "axios";
import { isMoment } from "moment";
import AssignmentIcon from '@mui/icons-material/Assignment';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import './AddOrEditTask.css'

const steps = [
 'todo','inprogress','review','completed'
];


export default function AddOrEditTask(props){
  // const [project, setProject] = React.useState('none');  
  const [projectList, setProjectList] = React.useState([]);  
  // const [owner, setOwner] = React.useState('none');  
  const [ownerList, setOwnerList] = React.useState([]);
  const [isEditTask] = React.useState(props.isEditTask)
  const [isValidStartDate,setIsValidStartDate] = React.useState(true)
  const [task, setTask] = React.useState({
    title:'',
    isPersonal:true,
    project:'none',
    owner:'none',
    startDate:null,
    endDate:null
    });
  const [validations,setValidations] = React.useState({
    title:false,
    dateRange:false,
    project:false,
    owner:false,
    isAttempted:false,
  });
  React.useEffect(()=>{
    if(isEditTask){
      axios.get('/task/getTaskById/'+props.editTaskPageInfo).then((response)=>{
        console.log(response.data)
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
    }else{
      // console.log(task)
    }
  },[isEditTask, props.editTaskPageInfo])
  React.useEffect(()=>{
  },[])
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
          setValidations({...validations,dateRange:true})
        } else {
          setValidations({...validations,dateRange:false})  
        }
    } else{
      switch(ev.target.name){
        case'title': setValidations({...validations, title:validator.isLength(ev.target.value,{min:3})})
          break;
        case 'project'||'owner': 
            task.isPersonal?
              setValidations({...validations, [ev.target.name]:false})
              :setValidations(ev.target.value!=='none')
          break;
        default:
          break;
      }
    }
  }

  const addTask=(ev)=>{
    ev.preventDefault();
    console.log(validations)
    if(validations.title && validations.dateRange && 
      (task.isPersonal||(!task.isPersonal && task.project && task.owner))){
        axios.post('/task/addNewTask',task).then((res)=>{
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
    console.log(validations)
    if(validations.title && validations.dateRange && 
      (task.isPersonal||(!task.isPersonal && task.project && task.owner))){
        axios.post('/task/updateTask',task).then((res)=>{
          props.reRenderTask('')
          props.reRenderTask('allTask')
          props.handleClose()
        })
      } else {
        setValidations({...validations, isAttempted:true})
      }
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
          <Grid item sx={{mb:1}} xs={12}>
            <FormControlLabel 
              name="isPersonal"
              control={
                <Checkbox checked={task.isPersonal}
                  onClick={updateValue}
              />} 
              label="Is this Personal task" 
            />
          </Grid>
          {
            !task.isPersonal?
            <Grid container spacing={2} sx={{ml:0}}>
              <Grid item xs={6}>
                <FormControl variant="standard" sx={{ minWidth: 175, mb:2 }}>
                  <InputLabel id="demo-simple-select-standard-label"
                  error={!validations.owner && !task.isPersonal && validations.isAttempted}>
                    Project
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    name="project"
                    id="demo-simple-select-standard"
                    value={task.project._id?task.project._id:'none'}
                    onChange={updateValue}
                    label="Project"
                    error={!validations.project && !task.isPersonal && validations.isAttempted}
                  >
                    <MenuItem value="none">None</MenuItem>
                    { 
                      projectList.map((project)=>
                        <MenuItem value={project._id}>{project.title}</MenuItem>  
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="standard" sx={{ minWidth: 175, ml:2, mb:2 }}>
                  <InputLabel id="demo-simple-select-standard-label" 
                  error={!validations.owner && !task.isPersonal && validations.isAttempted}>
                    Owner
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    name="owner"
                    id="demo-simple-select-standard"
                    value={task.owner._id?task.owner._id:'none'}
                    onChange={updateValue}
                    label="Owner"
                    error={!validations.owner && !task.isPersonal && validations.isAttempted}
                  >
                    <MenuItem value="none">None</MenuItem>
                    {
                      ownerList.map((owner)=>
                        <MenuItem value={owner._id}>{owner.name}</MenuItem>  
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
            rows={4}
            onChange={updateValue}
            />
          </Grid>
          {
            isEditTask
              ?<Box sx={{ width: '100%', my: 4 }}>
                <Stepper activeStep={steps.indexOf(task.transission)} nonLinear alternativeLabel>
                    <Step key='TODO'>
                      <StepButton color="inherit">
                        <StepLabel className={steps.indexOf(task.transission)===0?'activeStep':''} StepIconComponent={AssignmentIcon}>TODO</StepLabel>
                      </StepButton>
                    </Step>
                    <Step key='INPROGRESS'>
                      <StepButton color="inherit">
                        <StepLabel className={steps.indexOf(task.transission)===1?'activeStep':''} StepIconComponent={ModelTrainingIcon}>INPROGRESS</StepLabel>
                      </StepButton>
                    </Step>
                    <Step key='RREVIEW'>
                      <StepButton color="inherit">
                        <StepLabel className={steps.indexOf(task.transission)===2?'activeStep':''} StepIconComponent={ManageSearchIcon}>RREVIEW</StepLabel>
                      </StepButton>
                    </Step>
                    <Step key='COMPLETED'>
                      <StepButton disabled='false' color="inherit">
                        <StepLabel className={steps.indexOf(task.transission)===-3?'activeStep':''} StepIconComponent={CheckCircleOutlineRoundedIcon}>COMPLETED</StepLabel>
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