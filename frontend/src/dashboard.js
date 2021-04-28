import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import DiceRoller from "./dice-roller";

function ListItem(props){
    return(
        <div className={props.cName}>
            <li>{props.value}</li>
        </div>
    );
}



export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mechanicArr: [],
            isAdding: false,
        }
        this.handleAddMechanic = this.handleAddMechanic.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    handleAddMechanic = () => {
        this.setState({isAdding:true})
    }

    handleSubmitClick = (mechanicName) => {
        if(mechanicName==="DiceRoller"){
            let tempArr = this.state.mechanicArr;
            tempArr=[...tempArr,<DiceRoller/>];
            this.setState({mechanicArr:tempArr,isAdding:false});
        }
    }

    render() {
        const addToDashboard = <ListItem key={Math.random().toString(36).substr(2, 9)} value={<button onClick={this.handleAddMechanic}>+</button>} cName={"dashboard-mechanic-add"}/>;
        const addMechanic = <li>
            <div className="dashboard-mechanic-add-selector">
                <ol>
                    <ListItem key={Math.random().toString(36).substr(2, 9)} value={<button onClick={() => this.handleSubmitClick("DiceRoller")}>Add Dice Table Roll</button>} cName={"dashboard-mechanic-add-selector-selection"} />
                </ol>
            </div>
        </li>; 
        const currMechanicArr = this.state.mechanicArr;
        return (
            <div className="dashboard">
                <ul>
                    {currMechanicArr.map( (mechanic) =>
                        <ListItem key={Math.random().toString(36).substr(2, 9)} value={mechanic} cName={"dashboard-mechanic"}/>
                    )}
                    {!this.state.isAdding && addToDashboard}
                    {this.state.isAdding && addMechanic}
                </ul>
            </div>
        );
    }
}