import React, { useEffect, useState } from 'react';

import {
    Route,
    useParams,
    useRouteMatch,
    useHistory,
    Switch
} from "react-router-dom";
import { AppBar, Grid, makeStyles, Toolbar, Typography, Button, FormControl, Input, InputLabel, Select, MenuItem, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

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

function DashboardAction( { renderToggle, setRenderToggle, id, linkid, type, name, children } ){

    const deleteSelf = async() => {
        const requestBody = {linkid: linkid};
        const response = await fetch(`http://localhost:5000/action/delete-dashboard-action`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(requestBody)
        });
        const responseObj = await response.json();
        setRenderToggle(!renderToggle);
    }
    return ( 
        <div>
            <div>
                <Typography>{name}</Typography>
                <IconButton color='secondary' size='small' onClick={deleteSelf}><DeleteIcon /></IconButton>
            </div>
            {children}
        </div>
    );
}

function NewAction( { dashboardid, renderToggle, setRenderToggle } ){
    const [actionName, setActionName] = useState("");
    const [actionType, setActionType] = useState(1);
    let history = useHistory();

    const handleSubmit = async e => {
        e.preventDefault();
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
        history.goBack();
    }

    return (
        <form >
            <div>
                <FormControl> 
                    <InputLabel htmlFor="actionName">Name</InputLabel>
                    <Input id="actionName" value={ actionName } onChange={ e => setActionName(e.target.value) } required/>
                </FormControl>
            </div>
            <div>
                <InputLabel id="actionType">Type</InputLabel>
                <Select labelId="actionType" id="actionType" value={ actionType } onChange={ e => setActionType(e.target.value) }>
                    <MenuItem value={1}>Dice Roll Table</MenuItem>
                </Select>
            </div>
            <div>
                <Button type="submit" onClick={handleSubmit} >Submit</Button>
                <Button type="button" onClick={ handleCancel }>X</Button>
            </div>
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
                            actionComponentArr.push({id: currAction.actionid, component: <DashboardAction renderToggle={renderToggle} setRenderToggle={setRenderToggle} linkid={currAction.linkid} id={currAction.actionid} type={currAction.type} name={currAction.name}><DiceRoller actionid={ currAction.actionid } toUpdate={toUpdate} setToUpdate={handleActionUpdate} url={`/dashboard/${dashboardname}/${dashboardid}`}/></DashboardAction>});
                            break;
                        default:
                            actionComponentArr.push(<div><p>Error</p></div>);
                    }
                }
                setActionList(actionComponentArr);
            } catch (error) {
                
            }
        }; getDashboardActions();
    },[toUpdate, renderToggle])

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
                            <Route exact path={`${url}/selector/encounter-selector/:actionid/:position*`}>
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