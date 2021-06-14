import React, { useEffect, useState } from 'react';

import {
    Route,
    useParams,
    useRouteMatch,
    Switch
} from "react-router-dom";
import { AppBar, Grid, makeStyles, Toolbar, Typography, Button } from '@material-ui/core';

import DiceRoller from "./dice-roller";
import ListEncounter from "./listEncounter";

const useStyles = makeStyles((theme) => ({
    dashboard: {
        height: '100%',
    },
    title: {
        marginLeft: theme.spacing(2),
        display: 'block',
    },
    bannerDashboard: {
        flexGrow: 1,
    },
    bannerDashboardDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    bannerDashboardDesktopOption: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    bannerDashboardMobile: {

    },
    contentDashboard: {
        display: 'flex',
    },
    contentDashboardGrid: {
        flex: '1 1 auto',
    },
    dashboardGridItem: {
        marginTop: theme.spacing(2),
    },
    contentDashboardList: {
        flex: '1 1 25%',
        marginTop: theme.spacing(2),
        height: '100%',
    }
}))

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
            await response.json();
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
    const [toUpdate, setToUpdate] = useState("-1");
    const [renderToggle, setRenderToggle] = useState(false);
    const classes = useStyles();
    let {dashboardname, dashboardid } = useParams();

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
                            actionComponentArr.push({"id":currAction.actionid, 
                                                      "type":currAction.type, 
                                                      "name": currAction.name, 
                                                      "component":<DiceRoller actionid={ currAction.actionid } toUpdate={toUpdate} setToUpdate={handleActionUpdate} url={`/dashboard/${dashboardname}/${dashboardid}`}/>});
                            break;
                        default:
                            actionComponentArr.push(<div><p>Error</p></div>);
                    }
                }
                setActionList(actionComponentArr);
            } catch (error) {
                
            }
        }; getDashboardActions();
    },[toUpdate, ])

    const getNewActionValue = () => {
        if(!renderToggle){
            return <button onClick={ () => {setRenderToggle(!renderToggle)} }>New Action</button>;
        } else {
            return <NewAction dashboardid={dashboardid} renderToggle={renderToggle} setRenderToggle={setRenderToggle} />;
        }
    }

    function handleActionUpdate(actionid){
        setToUpdate(actionid);
    }

    return (
        <div className={classes.dashboard}>
            <Route path={`${url}`}>
                <div className={classes.bannerDashboard}>
                    <AppBar position="static">
                        <Toolbar variant="dense">
                            <Typography className={classes.title} variant="h5" color='textPrimary' noWrap>
                                { dashboardname }
                            </Typography>
                            <div className={classes.bannerDashboardDesktop}>
                                <div className={classes.bannerDashboardDesktopOption}><Button size="small" variant="contained" color="secondary" href={`${url}/creator/action-creator`}>New Action</Button></div>
                            </div>
                        </Toolbar>
                    </AppBar>
                </div>
                <div className={classes.contentDashboard}>
                    <div className={classes.contentDashboardGrid}>
                        {actionList.length>0 && 
                            <Grid container spacing={3} >
                                {
                                    actionList.map((action) => 
                                        <Grid item className={classes.dashboardGridItem}>{ action.component }</Grid>
                                    )
                                }
                            </Grid>
                        }
                    </div>
                    <div className={classes.contentDashboardList}>
                        <Switch>
                            <Route exact path={`${url}/selector/encounter-selector/:actionid/:position`}>
                                <ListEncounter classes={classes} handleActionUpdate={handleActionUpdate}/>
                            </Route>
                            <Route exact path={`${url}/creator/action-creator`}>
                                <NewAction dashboardid={ dashboardid } renderToggle={ renderToggle } setRenderToggle={ setRenderToggle }/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Route>
        </div>
    );
}