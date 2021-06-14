import React, {useEffect, useState} from 'react';

import useToken from './useToken';

import {
    useHistory,
    useParams
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, List, ListItem } from '@material-ui/core';

function NewEncounter( { userid, renderToggle, setRenderToggle } ){
    const [description, setDescription] = useState("");

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/action/new-encounter/${userid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept":"application/json" },
                body: JSON.stringify({ "description": description})
            });
            const respObj = await response.json();
            console.log("HERE");
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

export default function ListEncounter( { handleActionUpdate, classes }) {
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
    },[renderToggle])

    async function replaceEncounterAction(encounterid) {
        try {
            const response = await fetch(`http://localhost:5000/action/replace-encounter-action-rel`,{
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
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography className={classes.title} variant="h5" color='textPrimary' noWrap>
                        Encounters
                    </Typography>
                    <div className={classes.bannerDashboardDesktop}>
                        <div className={classes.bannerDashboardDesktopOption}><Button size="small" variant="contained" color="secondary">New</Button></div>
                    </div>
                </Toolbar>
            </AppBar>
            <List>
                {
                    encounterList.map((encounterObject) =>
                        <ListItem divider button color="textPrimary" onClick={ () => replaceEncounterAction(encounterObject.encounterid)}>{encounterObject.description}</ListItem>
                    )
                }
            </List>
        </div>
    );
}