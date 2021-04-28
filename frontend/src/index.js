import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import Dashboard from "./dashboard";

class App extends React.Component{
    render() {
        return (
            <Dashboard/>
        );
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);