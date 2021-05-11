import { render } from '@testing-library/react';
import React, { useEffect, useState } from 'react';

import {
    useParams
} from "react-router-dom";

import DiceRoller from "./dice-roller";

function ListItem(props){
    return <li>{props.value}</li>
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
                const actionList = await response.json();
                setActionList(actionList);
            } catch (error) {
                
            }
        }; getDashboardActions();
    },[])

    return (
        <div>
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