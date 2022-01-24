import React from "react";
import { Avatar, Button, Grid, IconButton, ListItem, ListItemButton, ListItemText, Modal, Typography } from "@mui/material";
import './Home.css';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { borderRadius, Box } from "@mui/system";
import AddOrEditTask from "../Common/AddOrEditTask/AddOrEditTask";

export default function Home(props){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return(
        <Grid container spacing={2}>
            <Grid className="mainAppHeader" item xs={12}><h1>Home</h1></Grid>
            <Grid className="mainAppHeader" item container xs={12}>
                <Grid item xs={6}><h3>Welcome userName</h3></Grid>
                <Grid item xs={6} sx={{textAlign:'right',mt:'10px',pr:'20px'}}>
                    <Button variant="contained" onClick={handleOpen}><AddRoundedIcon/>Add Task </Button>
                </Grid>  
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Grid className="todoList" item xs={12}>
                            <Grid className="todoDetails" item container xs={12}>
                                <Grid item xs={4}>
                                    <h1>Item</h1>
                                </Grid>
                                <Grid item xs={4}>
                                    <h1>Item</h1>
                                </Grid>
                                <Grid item xs={4}>
                                    <h1>Item</h1>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <ListItem >
                                  <ListItemButton>
                                    <ListItemText primary="Home"/>
                                  </ListItemButton>
                                </ListItem>
                                <ListItem >
                                  <ListItemButton>
                                    <ListItemText primary="Home"/>
                                  </ListItemButton>
                                </ListItem>
                                <ListItem >
                                  <ListItemButton>
                                    <ListItemText primary="Home"/>
                                  </ListItemButton>
                                </ListItem>
                                <ListItem >
                                  <ListItemButton>
                                    <ListItemText primary="Home"/>
                                  </ListItemButton>
                                </ListItem>
                                <ListItem >
                                  <ListItemButton>
                                    <ListItemText primary="Home"/>
                                  </ListItemButton>
                                </ListItem>
                            </Grid>
                            <div className="addTask">
                                <IconButton color="primary" aria-label="add to shopping cart">
                                    <Avatar><AddRoundedIcon /></Avatar>
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      // aria-labelledby="modal-modal-title"
                      // aria-describedby="modal-modal-description"
                      >
                        <Box>
                          <AddOrEditTask handleClose={handleClose}/>
                        </Box>
                    </Modal>
                </Grid>
            </Grid>
        </Grid>
        ) 
}