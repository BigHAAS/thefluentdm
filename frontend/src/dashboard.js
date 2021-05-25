import { render } from '@testing-library/react';
import React, { useEffect, useState } from 'react';

import {
    BrowserRouter as Router, 
    Route,
    useParams,
    useLocation,
    useRouteMatch,
    Switch
} from "react-router-dom";

import DiceRoller from "./dice-roller";

function ListItem(props){
    return <li>{props.value}</li>
}

function NewAction( { dashboardid, renderToggle, setRenderToggle } ){
    const [actionName, setActionName] = useState("");
    const [actionType, setActionType] = useState(1);

    const handleSubmit = async e => {
        try {
            const response = await fetch('http://localhost:5000/action/new-dashboard-action/diceRoller', {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept":"application/json" },
                body: JSON.stringify({ "actionName": actionName,
                        "actionType": actionType,
                        "dashboardid": dashboardid,
                        "position": 0})
            });
            const respObj = await response.json();
            setRenderToggle(!renderToggle);
        } catch (error) {
            
        }
    }

    const handleCancel = () => {
        setRenderToggle(!renderToggle);
    }

    return (
        <form onSubmit={ handleSubmit }>
            <label>Name
                <input name="actionName" type="text" value={ actionName } onChange={ e => setActionName(e.target.value) } required/>
            </label>
            <label htmlFor="actionType">Type</label>
            <select name="actionType" id="actionType" value={ actionType } onChange={ e => setActionType(e.target.value) }>
                <option value={1}>Dice Roll Table</option>
            </select>
            <button type="submit">Submit</button>
            <button type="button" onClick={ handleCancel }>X</button>
        </form>
    );
}

export default function Dashboard(){
    const { url } = useRouteMatch();
    const [actionList , setActionList] = useState([]);
    const [listOption, setListOption] = useState();
    const [renderToggle, setRenderToggle] = useState(false);
    let { dashboardid } = useParams();
    let location = useLocation();

    useEffect(() => {
        const getDashboardActions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/action/get-dashboard-actions/${dashboardid}`, {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                });
                const actionObjArr = await response.json();
                let actionComponentArr = [];
                for(let i=0;i<actionObjArr.length;i++){
                    let currAction = actionObjArr[i];
                    switch(currAction.type){
                        case 1:
                            actionComponentArr.push({"id":currAction.actionid, "type":currAction.type, "name": currAction.name, "component":<DiceRoller actionid={ currAction.actionid }/>});
                            break;
                        default:
                            actionComponentArr.push(<div><p>Error</p></div>);
                    }
                }
                setActionList(actionComponentArr);
            } catch (error) {
                
            }
        }; getDashboardActions();
    },[])

    const getNewActionValue = () => {
        if(!renderToggle){
            return <button onClick={ () => {setRenderToggle(!renderToggle)} }>New Action</button>;
        } else {
            return <NewAction dashboardid={dashboardid} renderToggle={renderToggle} setRenderToggle={setRenderToggle} />;
        }
    }

    return (
        <div className="dashboard">
            <ul>
                <ListItem key={0} 
                    value={ getNewActionValue() } 
                />
            </ul>
            {actionList.length>0 && 
                <ol>
                    {
                        actionList.map((action) => 
                            <ListItem key={ action.id } value={ action.component } />
                        )
                    }
                </ol>
            }
            <Route path={`${url}/list-selector/:${listOption}`}>
                
            </Route>
        </div>
    );
}