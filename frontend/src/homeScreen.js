import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import ListDashboard from './listDashboard';
import NewDashboard from './newDashboard';

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            choice: 0
        }
        this.handleLoadDashboard = this.handleLoadDashboard.bind(this);
        this.handleNewDashboard = this.handleNewDashboard.bind(this);
    }
    handleNewDashboard = () => {
        this.setState({choice:1});
    }
    handleLoadDashboard = () => {
        this.setState({choice:2});
    }
    render () {
        return (
            <div>
                {this.state.choice===0 && 
                    <div className="main-screen-options">
                        <button onClick={this.handleNewDashboard}>New Dashboard</button>
                        <button onClick={this.handleLoadDashboard}>Load Dashboard</button>
                    </div>
                }
                {this.state.choice===1 && 
                    <NewDashboard userid={this.props.userid}/>
                }
                {this.state.choice===2 && 
                    <ListDashboard userid={this.props.userid}/>
                }
            </div>
        );
    }
}