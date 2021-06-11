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
    selectionList: {
        marginTop: theme.spacing(1),
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
        <div className={classes.selectionList}>
            <List>
                {
                    dashboardList.map((dashboardObject) =>{
                        const linkToDashboard = <Link color='secondary' component={RouterLink} to={`/dashboard/${dashboardObject.name}/${dashboardObject.dashboardid}`}>{`${dashboardObject.name}`}</Link>;
                        return <ListItem>
                                    {linkToDashboard}
                                </ListItem>
                    })
                }
            </List>
            <Switch>
                <Route path="/dashboard/:dashboardname/:dashboardid">
                        <Dashboard />
                </Route>
            </Switch>
        </div>
    );
}