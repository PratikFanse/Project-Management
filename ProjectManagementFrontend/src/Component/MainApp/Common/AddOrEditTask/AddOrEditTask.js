import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import DateRangePicker from '@mui/lab/DateRangePicker';
import DateAdapter from '@mui/lab/AdapterMoment';

export default function AddOrEditTask(props){
  const [value, setValue] = React.useState([null, null]);  
  const [project, setProject] = React.useState('none');  
  const [owner, setOwner] = React.useState('none');
  const handleChange = (event) => {
    switch(event.target.name){
      case 'project': setProject(event.target.value);
        break;
      case 'owner': setOwner(event.target.value);
        break;
    }
  };
  return(
      <Box sx={style}>
        <Typography sx={{mb:1}} id="modal-modal-title" variant="h6" component="h2">
          Add Task
        </Typography>
        <Grid container  spacing={2}>
        <Grid item xs={12}>
            <TextField sx={{width:'100%', mb:2}}
            id="filled-textarea"
            label="Task Name"
            placeholder="Placeholder"
            variant="standard"
            size="small"
            />
        </Grid>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DateRangePicker
            disablePast
            value={value}
            // minDate={new Date()}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField sx={{ml:2, mb:2}} variant="standard" {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField sx={{mb:2}} variant="standard" {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Is this Personal task" />
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="standard" sx={{ minWidth: 175, mb:2 }}>
              <InputLabel id="demo-simple-select-standard-label">Project</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                name="project"
                id="demo-simple-select-standard"
                value={project}
                onChange={handleChange}
                label="Project"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value={10}>Project 1</MenuItem>
                <MenuItem value={20}>Project 1</MenuItem>
                <MenuItem value={30}>Project 1</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl variant="standard" sx={{ minWidth: 175, mb:2 }}>
              <InputLabel id="demo-simple-select-standard-label">Owner</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                name="owner"
                id="demo-simple-select-standard"
                value={owner}
                onChange={handleChange}
                label="Project"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value={10}>User 1</MenuItem>
                <MenuItem value={20}>User 2</MenuItem>
                <MenuItem value={30}>User 3</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField sx={{width:'100%'}}
            id="filled-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
            variant="filled"
            rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained">Add</Button>
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