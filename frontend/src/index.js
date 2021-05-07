import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Login from "./login-screen";
import HomeScreen from "./homeScreen";
import useToken from './useToken';

import {
    BrowserRouter as Router, 
    Redirect, 
    Route,
} from "react-router-dom";

function App(){
    const { token, setToken } = useToken();
    console.log(token);
    if(!token){
        return <Login setToken={setToken}/>
    }
    return (
        <Router>
            <Redirect exact from="/" to="/home"/> 
            <Route path="/home">
                <HomeScreen/>
            </Route>
        </Router>
    );
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);