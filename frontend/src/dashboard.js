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

        }
    }

    render() {
        return (
            <div>
                <p>Dashboard Page Successs Load</p>
            </div>
        );
    }
}