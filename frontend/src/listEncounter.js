import { render } from '@testing-library/react';
import React, {useEffect, useState} from 'react';

import useToken from './useToken';

import {
    //Redirect,
    Link,
    Switch,
    Route,
    //useRouteMatch
} from "react-router-dom";

function ListItem(props){
    return <li>{props.value}</li>
}

export default function ListEncounter() {
    const { token } = useToken();
    const [encounterList, setEncounterList] = useState([]);
    //const { url } = useRouteMatch();
    useEffect(() => {
        const getEncounterList = async () => {
            try {
                const response = await fetch(`http://localhost:5000/action/list-encounters/${token}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                })
                const encounterList = await response.json();
                setEncounterList(encounterList);
            } catch (error) {
                console.log(error);
            }
        }; getEncounterList();
    },[])

    return (
        <Switch>
            <Route path={`${url}/list-encounters`}>
                <ol>
                    {
                        encounterList.map((encounterObject) =>{
                            <ListItem key={encounterObject.encounterid} value={encounterObject.description}/>
                        })
                    }
                </ol>
            </Route>
        </Switch>
    );
}