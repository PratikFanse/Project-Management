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
import { Link } from 'react-router-dom';
const AddOrEditProject = React.lazy(() => import('./Project/AddOrEditProject'));

export default function Projects(props){
    const [userInfo] = React.useState(props.userInfo?props.userInfo:null)
    const [open, setOpen] = React.useState(false);
    const [isEditProjectPage,setIsEditProjectPage] = React.useState(false)
    const [editProjectPageInfo,setEditProjectPageInfo] = React.useState('')
    const [projectRoute, setProjectRoute] = React.useState();
    const [projectId, setProjectId] = React.useState(null);
    const [dataToggler, setDataToggler] = React.useState(true);
    const handleOpen = (isEdit,editTaskId) => {
      setEditProjectPageInfo(editTaskId?editTaskId:'');
      setIsEditProjectPage(isEdit)
      setOpen(true);
    }
    const handleClose = () => setOpen(false); 
    const [projectList, setProjectList] = React.useState([]);
    React.useEffect(() =>{
        axios.get('/project/getProjectList').then((res)=>{
            setProjectList(res.data)
        })
    },[dataToggler])
    const openProject =(id)=>{
      setProjectId({id})
    }
    React.useEffect(()=>{
      if(projectId)
        projectRoute.click()
    },[projectId])
    return(
      <React.Suspense fallback={<Loader/>}>
        <Grid className='projectsPage' container spacing={2}>
            <Grid className="mainAppHeader" item container xs={12}>
              <Grid item xs={6}>
                <h1>Projects</h1>
              </Grid>
              {userInfo && userInfo.role ==='admin' 
                ?<Grid item xs={6} sx={{textAlign:'right',mt:3,pr:9}}>
                      <Button variant="contained" onClick={()=>handleOpen(false)}
                      ><AddRoundedIcon/>Add Project </Button>
                </Grid>:''
              }  
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
                        <StyledTableRow onClick={()=>openProject(project._id)} hover className='projectRow' key={project._id}>
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
                    <AddOrEditProject isEditTask={isEditProjectPage} editProjectPageInfo={editProjectPageInfo} dataToggler={{dataToggler:dataToggler, setDataToggler:setDataToggler}} handleClose={handleClose}/>
                  </Box>
              </Modal>
            </Grid>
        </Grid>
        <Link to="/project" state={projectId} ref={input => setProjectRoute(input)}></Link>
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
