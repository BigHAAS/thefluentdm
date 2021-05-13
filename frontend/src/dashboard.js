import { render } from '@testing-library/react';
import React, { useEffect, useState } from 'react';

import {
    useParams
} from "react-router-dom";

import DiceRoller from "./dice-roller";

function ListItem(props){
    return <li>{props.value}</li>
}

function NewAction( { dashboardid } ){
    [actionName, setActionName] = useState("");
    [actionType, setActionType] = useState(0);

    const handleSubmit = async e => {

    }

    <form onSubmit={ handleSubmit }>
        <label>Name
            <input name="actionName" type="text" value={ actionName } onChange={ e => setActionName(e.target.value) }/>
        </label>
        <label for="actionType">Type</label>
        <select name="actionType" id="actionType" value={ actionType } onChange={ e => setActionType(e.target.value) }>
            <option value="1">Dice Roll Table</option>
        </select>
        <button>Submit</button>
    </form>
}

export default function Dashboard(){

    const [actionList , setActionList] = useState([]);
    let { dashboardid } = useParams();

    useEffect(() => {
        const getDashboardActions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/action/get-dashboard-actions/${dashboardid}`, {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                });
                const actionObj = await response.json();
                setActionList(actionList => [...actionList, actionObj]);
            } catch (error) {
                
            }
        }; getDashboardActions();
    },[])

    return (
        <div>
            <ul>
                <ListItem key={0} value={ <NewAction dashboardid={ dashboardid }/>} />
            </ul>
            <ol>
                {
                    actionList.map((action) => 
                        <ListItem key={action.actionid} value={action.name} />
                    )
                }
            </ol>
        </div>
    );
}