import React, {useEffect, useState} from 'react';

import useToken from './useToken';

import {
    useHistory,
    useParams,
    Route,
    useRouteMatch,
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, List, ListItem } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

function NewEncounter( { userid, renderToggle, setRenderToggle } ){
    const [description, setDescription] = useState("");
    let history = useHistory();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/action/new-encounter/${userid}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept":"application/json" },
                body: JSON.stringify({ "description": description})
            });
            const respObj = await response.json();
            history.goBack();
            setRenderToggle(!renderToggle);
        } catch (error) {
            
        }
    }

    return (
        <form>
            <label>Name
                <textarea name="encounter-description" value={ description } onChange={ e => setDescription(e.target.value) } required/>
            </label>
            <button type="submit" onClick={ handleSubmit }>Submit</button>
            <button type="button" onClick={ () => history.goBack() }>X</button>
        </form>
    );
}

export default function ListEncounter( { handleActionUpdate, classes }) {
    let history = useHistory();
    const { url } = useRouteMatch();
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

    return (
        <div>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography className={classes.title} variant="h5" color='textPrimary' noWrap>
                        Encounters
                    </Typography>
                    <div className={classes.bannerDashboardDesktop}>
                        <div className={classes.bannerDashboardDesktopOption}>
                            <Button size="small" variant="contained" color="secondary" onClick={() => history.push(`${url}/creator/encounter-creator`)}>New</Button>
                            <Button size="small" color="secondary" onClick={() => history.goBack()}><CancelIcon /></Button>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
            <div>
                <Route path="*/creator/encounter-creator">
                    <NewEncounter userid={token} renderToggle={renderToggle} setRenderToggle={setRenderToggle}/>
                </Route>
                <Route path="*/selector/encounter-selector/:actionid/:position*">
                    <List>
                        {
                            encounterList.map((encounterObject) =>
                                <ListItem divider button color="textPrimary" onClick={ () => replaceEncounterAction(encounterObject.encounterid)}>{encounterObject.description}</ListItem>
                            )
                        }
                    </List>
                </Route>
            </div>
        </div>
    );
}