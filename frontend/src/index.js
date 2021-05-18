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
        <div>
            {
                !token && <Redirect exact from="/" to="/login"/>
            }
            {
                token && <Redirect exact from="/" to="/home"/> 
            }
            <Switch>
            <Route exact path="/home">
                <HomeScreen setToken={setToken}/>
            </Route>
            <Route exact path="/login">
                <Login setToken={setToken}/>  
            </Route>
            </Switch>
        </div>
    );
}


ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);