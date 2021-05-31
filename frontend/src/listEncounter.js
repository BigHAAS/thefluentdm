import { render } from '@testing-library/react';
import React, {useEffect, useState} from 'react';

import useToken from './useToken';

import {
    useHistory,
    useParams
} from "react-router-dom";

function ListItem(props){
    return <li>{props.value}</li>
}

function NewEncounter( { userid, renderToggle, setRenderToggle } ){
    const [description, setDescription] = useState("");

    const handleSubmit = async e => {
        try {
            const response = await fetch(`http://localhost:5000/action/new-encounter/${userid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept":"application/json" },
                body: JSON.stringify({ "description": description})
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
                <textarea name="encounter-description" value={ description } onChange={ e => setDescription(e.target.value) } required/>
            </label>
            <button type="submit">Submit</button>
            <button type="button" onClick={ handleCancel }>X</button>
        </form>
    );
}

export default function ListEncounter( { handleActionUpdate }) {
    let history = useHistory();
    let {actionid, position } = useParams(); 
    const { token } = useToken();
    const [encounterList, setEncounterList] = useState([]);
    const [renderToggle, setRenderToggle] = useState(false);

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

    async function replaceEncounterAction(encounterid) {
        try {
            const response = await fetch(`http://localhost:5000/action/new-encounter-action-rel`,{
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    "actionid": actionid,
                    "encounterid": encounterid,
                    "position": position
                })
            })
            await response.json();
        } catch (error) {
            console.log(error);
        }
        handleActionUpdate(actionid);
        history.goBack();
    }

    const getNewEncounterValue = () => {
        if(!renderToggle){
            return <button onClick={ () => {setRenderToggle(!renderToggle)} }>New</button>;
        } else {
            return <NewEncounter userid={token} renderToggle={renderToggle} setRenderToggle={setRenderToggle} />;
        }
    }

    return (
        <div>
            <ol>
                <ListItem key={0} value={getNewEncounterValue()} />
            </ol>
            <ol>
                {
                    encounterList.map((encounterObject) =>
                        <li key={encounterObject.encounterid} onClick={ () => replaceEncounterAction(encounterObject.encounterid)}>{encounterObject.description}</li>
                    )
                }
            </ol>
        </div>
    );
}