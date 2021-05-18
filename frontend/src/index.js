import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Login from "./login-screen";
import HomeScreen from "./homeScreen";
import useToken from './useToken';

import {
    BrowserRouter as Router, 
    Redirect, 
    Route,
    Switch
} from "react-router-dom";

function App(){
    const { token, setToken } = useToken();

    return (
        <Switch>
            <Route path="/">
            {
                !token && <Redirect exact from="/" to="/login"/>
            }
            {
                token && <Redirect exact from="/" to="/home"/> 
            }
            </Route>
            <Route exact path="/home">
                <HomeScreen setToken={setToken}/>
            </Route>
            <Route exact path="/login">
                <Login setToken={setToken}/>  
            </Route>
        </Switch>
    );
}


ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);