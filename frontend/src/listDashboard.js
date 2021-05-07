import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router, 
    Switch,
    Route,
    Link
} from "react-router-dom";

import Dashboard from './dashboard';

function ListItem(props){
    return <li>{props.value}</li>
}

export default class ListDashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dashboardList: [],
        }
        this.dashboardid=null;
    }
    async componentDidMount(){
        try {
            const response = await fetch(`http://localhost:5000/dashboard/list-dashboards/${this.props.userid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
            })
            const dashboardList = await response.json();
            this.setState({dashboardList});
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        const dashboardListItems = this.state.dashboardList.map((dashboardObject) =>{
            const linkToDashboard = <Link to={`/${dashboardObject.dashboardid}`}>{dashboardObject.name}</Link>;
             return <ListItem key={dashboardObject.dashboardid} value={linkToDashboard}/>
        });
        return (
            <div>
                <Router>
                    <ol>
                        {dashboardListItems}
                    </ol>
                    <Switch>
                        <Route path="/:dashboardid">
                                <Dashboard dashboardid={({ match }) => { return match.params.dashboardid }} userid={this.props.userid}/>
                        </Route>
                    </Switch>
               </Router>
            </div>
        );
    }
}