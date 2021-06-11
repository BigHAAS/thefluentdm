import { render } from '@testing-library/react';
import { useTable } from 'react-table';
import React from 'react';
import ReactDOM from 'react-dom';

import dataFunction from './dataFunction'
import ListEncounter from './listEncounter'

import { useHistory } from "react-router-dom"

import { Typography, Button, TableContainer, TableCell, Table, TableRow, TableHead, TableBody, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';

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
    handleChange(event) {
        this.setState({newDice: event.target.value});
    }
    render() {
        let isEditing=this.state.isEditing;
        let input;
        let button;
        if(!isEditing){
            if(this.props.currDice===""){
                button=<Button size="small" variant="outlined" color="secondary" onClick={this.handleClick}>Add Dice</Button>;
            }
            else {
                button=<IconButton color="secondary" onClick={this.handleClick}><EditIcon/></IconButton>;
            }
        } else {
            input=<input value={this.state.newDice} onChange={this.handleChange}/>;
            button=<Button size="small"variant="outlined" color="secondary" onClick={this.handleSubmitClick}>Submit</Button>;
        }
        return (
            <div>
                {input}
                {button}
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

export default class DiceRoller extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //array of {col1: {index}, col2: {encounter description}}
            encounterData: [],
            diceToRoll:'',
            lastResult:'',
        }
        this.classes = {
            diceRollerContainer: {
            },
            diceSectionContainer: {
        
            },
            tableContainer: {
        
            },
            rollContainer: {
        
            }, 
        }
        this.setEncounterData=this.setEncounterData.bind(this);
        this.setEncounterIndex=this.setEncounterIndex.bind(this);
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
                for(let i=0;i<this.state.encounterData.length;i++){
                    if(this.state.encounterData[i].linkid!==null){
                        const response = await fetch(`http://localhost:5000/action/update-encounter-action-rel`,{
                            method: "PUT",
                            headers: { "Content-Type": "application/json", "Accept": "application/json" },
                            body: JSON.stringify({
                                "encounterid": this.state.encounterData[i].encounterid,
                                "position": this.state.encounterData[i].col1,
                                "linkid": this.state.encounterData[i].linkid
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
                                "position": this.state.encounterData[i].col1
                            })
                        })
                        await response.json(); 
                    }
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
    setEncounterIndex = (index,data) => {
        let trueIndex = getDiceMaxMinObj(this.state.diceToRoll).min+index;
        let tempArr = this.state.encounterData.slice();
        let formattedData = {col1:trueIndex,col2:data}
        tempArr.splice(index,1,formattedData);
        this.setState({encounterData:tempArr});
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
        this.removeOverflowBackend(this.state.encounterData.slice((diceMinMaxObj.max + 1 -diceMinMaxObj.min)));
        this.setState({encounterData:this.state.encounterData.slice(0,(diceMinMaxObj.max + 1 -diceMinMaxObj.min))});
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
        return (
            <div>
                <div className="dice">
                    <div className="dice-display">
                        <Typography color="textPrimary" noWrap>{this.state.diceToRoll}</Typography>
                    </div>
                    <div className="dice-editor">
                        <DiceEditor currDice={this.state.diceToRoll} setNewDice={this.setNewDice}/>
                    </div>
                </div>
                <div className="encounter-table">
                    <div className="encounter-table-data">
                        <NewTable /*headerParam={encounterHeader}*/ dataParam={encounterData} /*setEncounterIndex={this.setEncounterIndex}*/ url={this.props.url} actionid={this.props.actionid}/>
                    </div>
                    {overflowEncounterData.length>0 && 
                        <div className="encounter-table-overflow">
                            <NewTable /*headerParam= {overflowHeader}*/ dataParam={overflowEncounterData} /*setEncounterIndex={this.setEncounterIndex}*/ url={this.props.url} actionid={this.props.actionid}/>
                        </div>
                    }
                </div>
                {overflowEncounterData.length>0 && 
                    <div className="overflow-editor">
                        <Button size="small" variant="outlined" color="secondary" onClick={this.removeOverflow}>Delete All Overflow</Button>
                    </div>
                }
                {encounterData.length>0 && 
                    <div className="roll">
                        <div className="roll-dice">
                            <Button size="small" variant="outlined" color="secondary" onClick={this.handleRollClick}>Roll</Button>
                        </div>
                        <div className="roll-result">
                            <Typography>{this.state.lastResult}</Typography>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
