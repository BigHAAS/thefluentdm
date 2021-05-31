import { render } from '@testing-library/react';
import React, {useEffect, useState} from 'react';

import useToken from './useToken';
import Dashboard from './dashboard';

import {
    Redirect,
    Link,
    Switch,
    Route, 
    useHistory
} from "react-router-dom";

function ListItem(props){
    return <li>{props.value}</li>
}

export default function ListDashboard() {
    const { token, setToken } = useToken();
    let history = useHistory();
    const [dashboardList, setDashboardList] = useState([]);

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
        <div>
            <div className="dashboard-list">
                <ol>
                    {
                        dashboardList.map((dashboardObject) =>{
                            const linkToDashboard = <Link to={`/dashboard/${dashboardObject.dashboardid}`}>{`${dashboardObject.name}`}</Link>;
                            return <ListItem key={dashboardObject.dashboardid} value={linkToDashboard}/>
                        })
                    }
                </ol>
            </div>
            <Switch>
                <Route path="/dashboard/:dashboardid">
                        <Dashboard />
                </Route>
            </Switch>
        </div>
    );
}