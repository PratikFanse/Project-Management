import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Box, Button, Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Stack, Typography } from "@mui/material";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import validator from "validator";
import axios from "axios";
import { isMoment } from "moment";
import { useTheme } from '@mui/material/styles';
import './Project.css'
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
  
  function getStyles(name, selectedMembers, theme) {
    return {
      fontWeight:
        selectedMembers.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  
export default function AddOrEditProject(props){
  const [userInfo] = React.useState(props.userInfo)
  const [isEditProject] = React.useState(props.isEditProject)
  const [isValidStartDate,setIsValidStartDate] = React.useState(true)
  const theme = useTheme();
  
  const [memberList,setMemberList] = React.useState([]);
  React.useEffect(()=>{
    if(userInfo && userInfo.role!=='admin')
        props.handleClose()
  },[userInfo])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setProject({ ...project, members: typeof value === 'string' ? value.split(',') : value}
    );
  };
  const [project, setProject] = React.useState({
    title:'',
    startDate:null,
    endDate:null,
    members:[]
    });
  const [validations,setValidations] = React.useState({
    title:false,
    dateRange:false,
    isAttempted:false,
  });
  React.useEffect(()=>{
    if(isEditProject){
      axios.get('/project/getTaskById/'+props.editTaskPageInfo).then((response)=>{
        console.log(response.data)
        setProject(response.data)
        setIsValidStartDate(response.data.startDate?false:true)
        setValidations({
          title:true,
          dateRange:true,
          isAttempted:false,
        })
      })
    }
  },[isEditProject, props.editTaskPageInfo])
  React.useEffect(()=>{
    axios.get('/user/getUsersList/'+'allUser').then((res)=>{
        setMemberList(res.data)
    })
  },[])
  const updateValue = (ev) =>{
    setProject({...project, [ev.target.name]: ev.target.value})
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
        default:
          break;
      }
    }
  }

  const addTask=(ev)=>{
    ev.preventDefault();
    console.log(validations)
    if(validations.title && validations.dateRange){
        axios.post('/project/createProject',project).then((res)=>{
        //   props.reRenderTask('')
        // //   props.reRenderTask('allTask')
        //   props.handleClose()
        })
      } else {
        setValidations({...validations, isAttempted:true})
      }
  }
  const updateTask=(ev)=>{
    ev.preventDefault();
    console.log(validations)
    if(validations.title && validations.dateRange){
        axios.post('/project/updateTask',project).then((res)=>{
          props.reRenderTask('')
          props.reRenderTask('allTask')
          props.handleClose()
        })
      } else {
        setValidations({...validations, isAttempted:true})
      }
  }
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  const selectedMembers =(selected)=>{
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {memberList.map((member) => (
              selected.indexOf(member._id)!==-1?<Chip key={member._id} label={member.username} />:''
            ))}
        </Box>
    )
  }
  return(
      <Box component="form" autoComplete="off" onSubmit={isEditProject?updateTask:addTask} sx={style}>
        <Typography sx={{mb:1}} id="modal-modal-title" variant="h6" component="h2">
          {isEditProject?'Edit':'Add'} Project
        </Typography>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField sx={{width:'100%', mb:1}}
                id="filled-textarea"
                value={project.title}
                name="title"
                label="Project Name"
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
                value={[project.startDate,project.endDate]}
                // minDate={new Date()}
                onChange={(newValue) => {
                  newValue[1]
                    ?setProject({...project, startDate:newValue[0]._d, endDate:newValue[1]._d})
                    :setProject({...project, startDate:newValue[0]._d})
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
            <Grid item xs={12}>
              <TextField sx={{width:'100%'}}
              name="description"
              value={project.description?project.description:''}
              id="filled-textarea"
              label="Description"
              placeholder="Description"
              multiline
              variant="filled"
              rows={4}
              onChange={updateValue}
              />
            </Grid>

            <Grid item xs={12}>
                <FormControl className="selectMembers" sx={{mt:1,width: '100%' }}>
                    <InputLabel id="multiple-member-label">Chip</InputLabel>
                    <Select
                      labelId="multiple-member-label"
                      id="multiple-member"
                      multiple
                      value={project.members}
                      onChange={handleChange}
                      input={<OutlinedInput id="select-multiple-member" label="Chip" />}
                      renderValue={(selected) => selectedMembers(selected)}
                      MenuProps={MenuProps}
                    >
                      {memberList.map((member) => (
                        <MenuItem
                          key={member._id}
                          value={member._id}
                          style={getStyles(member._id, project.members, theme)}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={8}>{member.username}</Grid>
                                <Grid item sx={{textAlign:'right'}} xs={4}>
                                    <Chip
                                        sx={{textTransform: "uppercase"}}
                                        label={member.role}
                                        size="small"/>
                                </Grid>
                            </Grid>
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Button type='submit' variant="contained">{isEditProject?'Update':'Add'}</Button>
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