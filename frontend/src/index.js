import { render } from '@testing-library/react';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Login from "./login-screen";
import HomeScreen from "./homeScreen";


import {
    BrowserRouter as Router, 
    Redirect, 
    Route,
    Switch,
} from "react-router-dom";

function App(){
    const [token, setToken] = useState();
    if(!token){
        return (
            <Router>
                <Redirect exact from="/" to="/login" />
                <Route path="/login">
                    <Login/>
                </Route>
            </Router>
        );
    }
    return (
        <Router>
            <div>
                <Switch>
                    <Redirect exact from="/" to="/home"/> 
                    <Route path="/home">
                        <HomeScreen/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);