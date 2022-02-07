import { FormControl, Grid, ListItem, ListItemButton, ListItemText, MenuItem, Select, Tooltip } from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router';
import './people.css'
import '../Common/Tasks/Tasks.css'

export default function People(props){
    const navigate = useNavigate();
    const [userList, setUserList] = React.useState([]);
    const [userInfo] = React.useState(props.userInfo);
    const [userFilter, setUserFilter] = React.useState('allUser');
    const [toggle, setToggle] = React.useState(false);
    React.useEffect(()=>{
        if(userInfo && userInfo.role!=='admin')
            navigate('/home')
        else{
            setUserFilter('allUser')
        }
    },[userInfo])
    React.useEffect(() =>{
        axios.get('/user/getUsersList/'+userFilter).then((res)=>{
            setUserList(res.data)
        })
    },[userFilter,toggle])
    const selectFilter = (event) => {
        setUserFilter(event.target.value);
    };
    const changeRole =(userId,ev)=>{
        const newRole = {userId: userId, role:ev.target.value}
        axios.put('/user/updateUserRole/',newRole).then((res)=>{
            setToggle(!toggle)
            setUserFilter(userFilter)
        })
    }
    return(
        <Grid container spacing={2}>
            <Grid className="mainAppHeader" item xs={12}><h1>People</h1></Grid>
            <Grid item xs={6}>
                <Grid className="todoList" item container xs={12}>
                    <Grid className="userCategory" item xs={12}>
                        <FormControl id="userFilter" sx={{ m: 1, minWidth: 120 }}>
                          <Select
                            variant="outlined"
                            className='selectFilter'
                            value={userFilter}
                            onChange={selectFilter}
                            label="User filter"
                          >
                            <MenuItem value='allUser'>All user</MenuItem>
                            <MenuItem value='admin'>Admin</MenuItem>
                            <MenuItem value='manager'>Manager</MenuItem>
                            <MenuItem value='QA'>QA</MenuItem>
                            <MenuItem value='employee'>Employee</MenuItem>
                          </Select>
                        </FormControl>
                    </Grid>
                    <Grid className="taskList" item xs={12}>
                        {
                          userList.map((user)=>(
                            <ListItem key={user._id}>
                                <ListItemButton disabled={user.email===props.userInfo.sub} className="itemButton" sx={{pl:1,mr:"0"}}>
                                  <ListItemText primary={user.username}/>
                                  <ListItemText > <b>Email:</b> {user.email} </ListItemText>
                                  <ListItemText className="userRole">
                                    <Select
                                      id="demo-controlled-open-select"
                                      value={user.role}
                                      onChange={(event)=> changeRole(user._id,event)}
                                      disabled={user.email===props.userInfo.sub}
                                    >
                                      <MenuItem value='employee'>Employee</MenuItem>
                                      <MenuItem value='QA'>QA</MenuItem>
                                      <MenuItem value='manager'>Manager</MenuItem>
                                      <MenuItem value='admin'>Admin</MenuItem>
                                    </Select>
                                  </ListItemText>                                                                                
                                </ListItemButton>
                            </ListItem>
                          ))
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}