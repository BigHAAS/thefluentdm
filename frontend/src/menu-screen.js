import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

export default class MainScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    handleNewDashboard = () => {
        
    }
    handleLoadDashboard() {
        
    }
    render () {
        return (
            <div className="main-screen-options">
                <button onClick={this.handleNewDashboard}>New Dashboard</button>
                <button onClick={this.handleLoadDashboard}>Load Dashboard</button>
            </div>
        );
    }
}