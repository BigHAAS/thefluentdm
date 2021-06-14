import React from 'react';
import PropTypes from 'prop-types'

import { useHistory } from "react-router-dom"

import { Input, Typography, Button, TableContainer, TableCell, Table, TableRow, TableHead, TableBody, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = theme => ({
    diceRollerContainer: {
        flexGrow: 1,
    },
    diceSectionContainer: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
    },
    diceDisplay: {
        
    },
    diceEditor: {
        marginRight: 'auto',
        marginLeft: theme.spacing(2),
    },
    tableActionContainer: {
        display: 'flex',
    },
    tableAction: {
        flex: '1 1 50%',
    },
    rollResult: {

    }, 
});



const getDiceMaxMinObj = (diceToRoll) => {
    let formattedDiceArr = diceToRoll.replace(/ /g,'').split("+");
    let max=0;
    let min=0;
    for(let i=0;i<formattedDiceArr.length;i++){
        let numDice=parseInt(formattedDiceArr[i].charAt(0));
        let diceFaceMax=parseInt(formattedDiceArr[i].substr(2));
        max += (numDice*diceFaceMax);
        min += (numDice);
    }
    return {"max":max,"min":min};
}
const getDiceRoll = (diceToRoll) => {
    let result=0;
    let formattedDiceArr = diceToRoll.replace(/ /g,'').split("+");
    for(let i=0;i<formattedDiceArr.length;i++){
        let numDice=parseInt(formattedDiceArr[i].charAt(0));
        let diceFaceMax=parseInt(formattedDiceArr[i].substr(2));
        for(let j=0;j<numDice;j++){
            result+=(Math.floor(Math.random()*diceFaceMax));
        }
    }
    return result;
}

class DiceEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newDice:'',
            isEditing: false
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleClick=this.handleClick.bind(this);
        this.handleSubmitClick=this.handleSubmitClick.bind(this);
    }
    handleClick(){
        this.setState({isEditing:true});

    }
    handleSubmitClick = () => {
        const newDice = this.state.newDice;
        if(/^\d+[d]\d+([+]\d+[d]\d+)*$/.test(newDice.replace(/ /g,''))){
            this.props.setNewDice(newDice);
            this.setState({newDice:'',isEditing:false});
        } 
    }
    handleCancelClick = () => {
        this.setState({newDice:'',isEditing:false});
    }
    handleChange(event) {
        this.setState({newDice: event.target.value});
    }
    render() {
        let isEditing=this.state.isEditing;
        let input;
        let button;
        if(!isEditing){
            if(this.props.currDice===""){
                button=<IconButton size="small" color="secondary" onClick={this.handleClick}><AddIcon/></IconButton>;
            }
            else {
                button=<IconButton size="small" color="secondary" onClick={this.handleClick}><EditIcon/></IconButton>;
            }
        } else {
            input=<Input value={this.state.newDice} onChange={this.handleChange}/>;
            button=<IconButton size="small" color="secondary" onClick={this.handleSubmitClick}><DoneIcon/></IconButton>;
        }
        return (
            <div className={this.props.className}> 
                {input}
                {button}
                {isEditing && <IconButton size="small" color="secondary" onClick={this.handleCancelClick}><CancelIcon/></IconButton>}
            </div>
        );
    }
}
function NewTable({ dataParam, url, actionid }){ 
    const history = useHistory();
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" >Dice Roll</TableCell>
                        <TableCell align="center">Encounter</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataParam.map((data) => {
                            return (
                                <TableRow>
                                    <TableCell>{data.col1}</TableCell>
                                    <TableCell>{data.col2}</TableCell>
                                    <TableCell><IconButton color="secondary" onClick={() => history.push(`${url}/selector/encounter-selector/${actionid}/${data.col1}`)}><SearchIcon/></IconButton></TableCell>
                                </TableRow>
                            )
                    })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

class DiceRoller extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //array of {col1: {index}, col2: {encounter description}}
            encounterData: [],
            diceToRoll:'',
            lastResult:'',
        }
        this.setNewDice=this.setNewDice.bind(this);
        this.handleRollClick=this.handleRollClick.bind(this);
    }
    async componentDidUpdate(prevProps, prevState){
        if(prevState.diceToRoll !== this.state.diceToRoll){
            try {
                const response = await fetch(`http://localhost:5000/action/diceroller/update/dice/${this.props.actionid}/`, {
                    method: "PUT",
                    headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({diceToBeSet: this.state.diceToRoll})
                });
                await response.json();
                const tempEncounterData = this.state.encounterData;
                let updatedEncounterData=false; 
                for(let i=0;i<tempEncounterData.length;i++){
                    if(tempEncounterData[i].linkid!==null){
                        const response = await fetch(`http://localhost:5000/action/update-encounter-action-rel`,{
                            method: "PUT",
                            headers: { "Content-Type": "application/json", "Accept": "application/json" },
                            body: JSON.stringify({
                                "encounterid": tempEncounterData[i].encounterid,
                                "position": tempEncounterData[i].col1,
                                "linkid": tempEncounterData[i].linkid
                            })
                        })
                        await response.json();
                    } else {
                        const response = await fetch(`http://localhost:5000/action/replace-encounter-action-rel`,{
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Accept": "application/json" },
                            body: JSON.stringify({
                                "actionid": this.props.actionid,
                                "encounterid": null,
                                "position": tempEncounterData[i].col1
                            })
                        })
                        const updateResponse = await response.json(); 
                        tempEncounterData[i].linkid=updateResponse.linkid;
                        updatedEncounterData=true;
                    }
                }
                if(updatedEncounterData){
                    this.setState({encounterData: tempEncounterData});
                }
            } catch (error) {

            }
        }
        if(this.props.toUpdate!==prevProps.toUpdate && this.props.toUpdate==this.props.actionid){
            try {
                const response = await fetch(`http://localhost:5000/action/diceroller/${this.props.actionid}/`, {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                });
                const diceRollerObj = await response.json();
                const encounterData = diceRollerObj.diceEncounterArr;
                this.setState({encounterData});
            } catch (error) {
                
            }
            this.props.setToUpdate("-1");
        }
    }
    async componentDidMount() {
        try {
            const response = await fetch(`http://localhost:5000/action/diceroller/${this.props.actionid}/`, {
                method: "GET",
                headers: { "Accept": "application/json" },
            });
            const diceRollerObj = await response.json();
            const encounterData = diceRollerObj.diceEncounterArr;
            const diceToRoll = diceRollerObj.diceValue;
            this.setState({encounterData,diceToRoll});
        } catch (error) {
            
        }
    }

    setEncounterData() {
        let diceMinMaxObj = getDiceMaxMinObj(this.state.diceToRoll);
        let tempArr=[];
        let currState = this.state.encounterData.slice();
        if(currState.length===0){
            for(let i=diceMinMaxObj.min;i<=diceMinMaxObj.max;i++){
                tempArr.push({col1: i,col2:null, encounterid: null, linkid: null});
            }
        } else {
            let i=0;
            let tempMin = diceMinMaxObj.min;
            for(;i<currState.length;i++,tempMin++){
                tempArr.push({col1: tempMin,col2:currState[i].col2, encounterid: currState[i].encounterid, linkid: currState[i].linkid});
            }
            for(;tempMin<=diceMinMaxObj.max;tempMin++){
                tempArr.push({col1:tempMin,col2:null, encounterid: null, linkid: null});
            }
        } 
        this.setState({encounterData:tempArr});
    }
    setNewDice(newDice) {
        this.setState({diceToRoll:newDice}, this.setEncounterData);
    }

    async removeOverflowBackend(arrayToRemove){
        try {
            for(let i=0;i<arrayToRemove.length;i++){
                const response = await fetch(`http://localhost:5000/action/delete-encounter-action-rel`,{
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                        "linkid": arrayToRemove[i].linkid,
                    })
                })
                await response.json();
            }
        } catch (error) {
            console.log(error);
        }

    }

    removeOverflow = () => {
        let diceMinMaxObj = getDiceMaxMinObj(this.state.diceToRoll);
        this.setState({encounterData:this.state.encounterData.slice(0,(diceMinMaxObj.max + 1 -diceMinMaxObj.min))});
        this.removeOverflowBackend(this.state.encounterData.slice((diceMinMaxObj.max + 1 -diceMinMaxObj.min)));
    }
    handleRollClick = () => {
        let roll = getDiceRoll(this.state.diceToRoll);
        console.log("Rolled a: "+roll);
        this.setState({lastResult:this.state.encounterData[roll].col2});
    }
    render() {
        const encounterHeader = [{Header: 'Dice Roll',accessor:"col1"},{Header:'Encounter',accessor:'col2'}];
        const overflowHeader = [{Header: 'Warning: Previously entered encounters will never be reached',accessor:"col1"},{Header:'',accessor:'col2'}];
        let diceMinMaxObj = getDiceMaxMinObj(this.state.diceToRoll);
        let overflowEncounterData=this.state.encounterData.slice();
        let encounterData = overflowEncounterData.splice(0,(diceMinMaxObj.max + 1 -diceMinMaxObj.min));
        const { classes } = this.props;
        return (
            <div className={classes.diceRollerContainer}>
                <div className={classes.diceSectionContainer}>
                    <div className={classes.diceDisplay}>
                        <Typography variant="h6" color="textPrimary" noWrap>{this.state.diceToRoll}</Typography>
                    </div>
                    <DiceEditor className={classes.diceEditor} currDice={this.state.diceToRoll} setNewDice={this.setNewDice}/>
                </div>
                <div className="encounter-table">
                    <div className="encounter-table-data">
                        <NewTable dataParam={encounterData} url={this.props.url} actionid={this.props.actionid}/>
                    </div>
                    {overflowEncounterData.length>0 && 
                        <div className="encounter-table-overflow">
                            <NewTable dataParam={overflowEncounterData} url={this.props.url} actionid={this.props.actionid}/>
                        </div>
                    }
                </div>
                <div className={classes.tableActionContainer}>
                    {overflowEncounterData.length>0 && 
                        <div className={classes.tableAction}>
                            <Button fullWidth size="small" variant="outlined" color="secondary" onClick={this.removeOverflow}>Delete Overflow</Button>
                        </div>
                    }
                    {encounterData.length>0 && 
                        <div className={classes.tableAction}>
                            <Button fullWidth size="small" variant="outlined" color="secondary" onClick={this.handleRollClick}>Roll</Button>
                        </div>
                    }
                </div>
                <div className={classes.rollResult}>
                        <Typography>{this.state.lastResult}</Typography>
                </div>
            </div>
        );
    }
}

DiceRoller.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DiceRoller);