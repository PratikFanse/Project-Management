import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import React from "react";
import { NavLink } from 'react-router-dom';
import './Side.nav.css';

export default function Sidenav(){
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