import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import React from "react";
import { NavLink } from 'react-router-dom';
import './Side.nav.css';

export default function Sidenav(props){
    return(
        <div className="sideNavContainer">
            <br/>
            <List>
                <NavLink to='/home'>
                    <ListItem className="sideNavItem">
                        <ListItemIcon>
                            <HomeRoundedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                </NavLink>
                {
                    props.userInfo && props.userInfo.role==="admin"
                        ?<NavLink to='/people'>
                            <ListItem className="sideNavItem">
                                <ListItemIcon>
                                    <PeopleRoundedIcon/>
                                </ListItemIcon>
                                <ListItemText primary="People"/>
                            </ListItem>
                        </NavLink>
                        :''
                }
                <ListItem  className="sideNavItem">
                    <ListItemIcon>
                        <BusinessCenterOutlinedIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Projects"/>
                </ListItem>
            </List>
        </div> 
        )
}