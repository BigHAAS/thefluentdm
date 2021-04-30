import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import LoginScreen from "./login-screen";

class App extends React.Component{
    render() {
        return (
            <LoginScreen/>
        );
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);