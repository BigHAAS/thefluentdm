import { render } from '@testing-library/react';
import React, { useEffect, useState } from 'react';

import ListDashboard from './listDashboard';
import NewDashboard from './newDashboard';

import {
    BrowserRouter as Router, 
    Link, 
    Redirect, 
    Route,
    Switch,
    useRouteMatch,
} from "react-router-dom";

function Logout( { setToken } ) {
    useEffect(() => {
        setToken({});
    })
    return (
        <Redirect to="/login"/>
    );
}

export default function HomeScreen( {setToken } ) {
    const { url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path="/home">
                <div className="main-screen-options">
                    <ul>
                        <li><Link to="/create-dashboard">New Dashboard</Link></li>
                        <li><Link to="/home/list-dashboard">Load Dashboard</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>
            </Route>
            <Route exact path={`${url}/create-dashboard`}>
                <NewDashboard />
            </Route>
            <Route exact path={`${url}/list-dashboard`}>
                <ListDashboard />
            </Route>
            <Route path="/logout">
                <Logout exact setToken={setToken}/>
            </Route>
        </Switch>
    );
}