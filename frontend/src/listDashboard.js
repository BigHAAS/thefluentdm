import { render } from '@testing-library/react';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

import useToken from './useToken';

import {
    BrowserRouter as Router, 
    Switch,
    Route,
    Link
} from "react-router-dom";

import Dashboard from './dashboard';

function ListItem(props){
    return <li>{props.value}</li>
}

export default function ListDashboard() {
    
    const { token, setToken } = useToken();
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
            <Router>
                <ol>
                    {
                        dashboardList.map((dashboardObject) =>{
                            const linkToDashboard = <Link to={`/dashboard/${dashboardObject.dashboardid}`}>{dashboardObject.name}</Link>;
                            return <ListItem key={dashboardObject.dashboardid} value={linkToDashboard}/>
                        })
                    }
                </ol>
                <Switch>
                    <Route path="/dashboard/:dashboardid">
                            <Dashboard dashboardid={({ match }) => { return match.params.dashboardid }} />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}