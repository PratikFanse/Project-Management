import { Button, Grid, Modal, Table, TableContainer, TableHead, TableRow} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import moment from 'moment';
import './Projects.css'
import Loader from '../../Common/loader';
const AddOrEditProject = React.lazy(() => import('./Project/AddOrEditProject'));

export default function Projects(props){
    const navigate = useNavigate();
    const [userList, setUserList] = React.useState([]);
    const [userInfo] = React.useState(props.userInfo);
    const [userFilter, setUserFilter] = React.useState('allUser');
    const [toggle, setToggle] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [isEditTaskPage,setIsEditTaskPage] = React.useState(false)
    const [editTaskPageInfo,setEditTaskPageInfo] = React.useState('')
    const handleOpen = (isEdit,editTaskId) => {
      setEditTaskPageInfo(editTaskId?editTaskId:'');
      setIsEditTaskPage(isEdit)
      setOpen(true);
    }
    const handleClose = () => setOpen(false); 
    const [projectList, setProjectList] = React.useState([]);
    const [taskCategory, setTaskCategory] = React.useState('allTask')
    const fetchTaskList =(taskListType)=>{
      setTaskCategory(taskListType)
    }
    React.useEffect(() =>{
        axios.get('/project/getProjectList').then((res)=>{
          console.log(res.data)
            setProjectList(res.data)
        })
    },[toggle])
    const selectFilter = (event) => {
        setUserFilter(event.target.value);
    };
    const changeRole =(userId,ev)=>{
        console.log(ev.target.value, userId)
        const newRole = {userId: userId, role:ev.target.value}
        axios.put('/user/updateUserRole/',newRole).then((res)=>{
            setToggle(!toggle)
            setUserFilter(userFilter)
        })
    }
    return(

      <React.Suspense fallback={<Loader/>}>
        <Grid className='projectsPage' container spacing={2}>
            <Grid className="mainAppHeader" item container xs={12}>
              <Grid item xs={6}>
                <h1>Projects</h1>
              </Grid>
              <Grid item xs={6} sx={{textAlign:'right',mt:3,pr:9}}>
                    <Button variant="contained" onClick={()=>handleOpen(false)}
                    ><AddRoundedIcon/>Add Project </Button>
              </Grid>  
            </Grid>
            <Grid item sx={{m:2,mr:4}} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Project</StyledTableCell>
                      <StyledTableCell align="right">Status</StyledTableCell>
                      <StyledTableCell align="right">Owner</StyledTableCell>
                      <StyledTableCell align="right">Start Date</StyledTableCell>
                      <StyledTableCell align="right">End Date</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectList.map((project) => (
                      <StyledTableRow hover className='projectRow' key={project._id}>
                        <StyledTableCell component="th" scope="row">
                          {project.title}
                        </StyledTableCell>
                        <StyledTableCell align="right">{project.status}</StyledTableCell>
                        <StyledTableCell align="right">{project.owner.username}</StyledTableCell>
                        <StyledTableCell align="right">{moment(project.startDate).format('MMM-DD-YYYY')}</StyledTableCell>
                        <StyledTableCell align="right">{moment(project.endDate).format('MMM-DD-YYYY')}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Modal
                open={open}
                onClose={handleClose}
                // aria-labelledby="modal-modal-title"
                // aria-describedby="modal-modal-description"
                >
                  <Box>
                    <AddOrEditProject isEditTask={isEditTaskPage} editTaskPageInfo={editTaskPageInfo} reRenderTask={setTaskCategory} handleClose={handleClose}/>
                  </Box>
              </Modal>
            </Grid>
        </Grid>
        </React.Suspense>
    )
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#2d2f35',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
