import React, {useEffect, useState} from 'react';

import useToken from './useToken';
import Dashboard from './dashboard';

import Link from '@material-ui/core/Link';
import { List, ListItem, makeStyles } from '@material-ui/core';
import {
    Link as RouterLink,
    Switch,
    Route, 
    useHistory
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    selectionList: {
        display: 'flex'
    },
}));

export default function ListDashboard() {
    const { token, setToken } = useToken();
    let history = useHistory();
    const [dashboardList, setDashboardList] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        const getDashboardList = async () => {
            try {
                const response = await fetch(`http://localhost:5000/dashboard/list-dashboards/${token}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                })
                const dashboardList = await response.json();
                setDashboardList(dashboardList);
            } catch (error) {
                console.log(error);
            }
        }; getDashboardList();
    },[])

    return (
        <div className={classes.root}>
            <div className={classes.selectionList}>
                <List>
                    {
                        dashboardList.map((dashboardObject) =>{
                            const linkToDashboard = <Link component={RouterLink} to={`/dashboard/${dashboardObject.dashboardid}`}>{`${dashboardObject.name}`}</Link>;
                            return <ListItem>
                                        {linkToDashboard}
                                    </ListItem>
                        })
                    }
                </List>
            </div>
            <Switch>
                <Route path="/dashboard/:dashboardid">
                        <Dashboard />
                </Route>
            </Switch>
        </div>
    );
}