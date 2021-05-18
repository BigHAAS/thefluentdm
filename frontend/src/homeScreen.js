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
    return (
        <Router>
            <Switch>
                <Route>
                    <div className="main-screen-options">
                        <ul>
                            <li><Link to="/home/create-dashboard">New Dashboard</Link></li>
                            <li><Link to="/home/list-dashboard">Load Dashboard</Link></li>
                            <li><Link to="/logout">Logout</Link></li>
                        </ul>
                    </div>
                </Route>
                <Route exact path="/home/create-dashboard">
                    <NewDashboard />
                </Route>
                <Route exact path="/home/list-dashboard">
                    <ListDashboard />
                </Route>
                <Route exact path="/logout">
                    <Logout setToken={setToken}/>
                </Route>
            </Switch>
        </Router>
    );
}