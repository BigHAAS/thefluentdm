import { render } from '@testing-library/react';
import React, {useEffect, useState} from 'react';

import useToken from './useToken';
import Dashboard from './dashboard';

import {
    Redirect,
    Link,
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";

function ListItem(props){
    return <li>{props.value}</li>
}

export default function ListDashboard() {
    const { token, setToken } = useToken();
    const [dashboardList, setDashboardList] = useState([]);
    const { url } = useRouteMatch();
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
        <Switch>
            <Route path={`${url}`}>
                <ol>
                    {
                        dashboardList.map((dashboardObject) =>{
                            const linkToDashboard = <Link to={`/dashboard/${dashboardObject.dashboardid}`}>{`${dashboardObject.name}`}</Link>;
                            return <ListItem key={dashboardObject.dashboardid} value={linkToDashboard}/>
                        })
                    }
                </ol>
            </Route>
            <Route path="/dashboard/:dashboardid">
                    <Dashboard />
            </Route>
        </Switch>
    );
}