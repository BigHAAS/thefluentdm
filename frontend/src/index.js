import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Login from "./login-screen";
import HomeScreen from "./homeScreen";
import Dashboard from "./dashboard";
import useToken from './useToken';

import {
    BrowserRouter as Router, 
    Redirect, 
    Route,
    Switch
} from "react-router-dom";

function App(){
    const { token, setToken } = useToken();
    
    return(
        <Router>
            <Switch>
                {
                    !token && <Route path="/"> <Redirect exact from="/" to="/login"/></Route>
                }
                <Route exact path="/">
                    <Redirect exact from="/" to="/home" />
                </Route>
                <Route exact path="/login">
                    <Login setToken={setToken}/>  
                </Route>
                <Route path="/home">
                    <HomeScreen setToken={setToken}/>
                </Route>
                <Route path="/dashboard/:dashboardid">
                    <Dashboard />
                </Route>
            </Switch>
        </Router>
    );
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);