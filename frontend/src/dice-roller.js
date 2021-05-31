import { render } from '@testing-library/react';
import { useTable } from 'react-table';
import React from 'react';
import ReactDOM from 'react-dom';

import dataFunction from './dataFunction'
import ListEncounter from './listEncounter'

import { useHistory } from "react-router-dom"

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
function EditorButton(props){
    return <button onClick={props.onClick}>{props.message}</button>
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
                button=<EditorButton onClick={this.handleClick} message="Add Dice" />;
            }
            else {
                button=<EditorButton onClick={this.handleClick} message="Edit Dice" />;
            }
        } else {
            input=<input value={this.state.newDice} onChange={this.handleChange}/>;
            button=<EditorButton onClick={this.handleSubmitClick} message="Submit" />;
        }
        return (
            <div>
                {input}
                {button}
            </div>
        );
    }
}
const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    setEncounterIndex,
}) => {
    const [value,setValue] = React.useState(initialValue);

    const onChange = e => {
        setValue(e.target.value);
        setEncounterIndex(index,e.target.value);
    }

    React.useEffect(() => {
        setValue(initialValue)
    },[initialValue])

    if(id==="col1" || id==="col2"){
        return <input value={value} onChange={onChange} readOnly/>
    } else {
        return <input value={value} onChange={onChange}/>
    }
}

const defaultColumn = {
    Cell:EditableCell
}

function Table({ headerParam, dataParam, setEncounterIndex, url, actionid }) {
    const history = useHistory();
    //const location = useLocation();
    const columns = React.useMemo(
        () => dataFunction(headerParam),[headerParam]
    );
    const data = React.useMemo(
        () => dataFunction(dataParam),[dataParam]
    );
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns,
        data,
        defaultColumn,
        setEncounterIndex,
    });
    return (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                  <td>
                      <button onClick={() => history.push(`${url}/encounter-selector/${actionid}/${row.cells[0].value}`)}>+</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )
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
        this.setEncounterData=this.setEncounterData.bind(this);
        this.setEncounterIndex=this.setEncounterIndex.bind(this);
        this.setNewDice=this.setNewDice.bind(this);
        this.handleRollClick=this.handleRollClick.bind(this);
    }
    async componentDidUpdate(prevProps, prevState){
        if(prevState.diceToRoll !== this.state.diceToRoll){
            try {
                const response = await fetch(`http://localhost:5000/action/diceroller/update/${this.props.actionid}/`, {
                    method: "PUT",
                    headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({diceToBeSet: this.state.diceToRoll, encounterData: this.state.encounterData})
                });
                await response.json();
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
                tempArr.push({col1: i,col2:''});
            }
        } else {
            let i=0;
            let tempMin = diceMinMaxObj.min;
            for(;i<currState.length;i++,tempMin++){
                tempArr.push({col1: tempMin,col2:currState[i].col2});
            }
            for(;tempMin<=diceMinMaxObj.max;tempMin++){
                tempArr.push({col1:tempMin,col2:''});
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
    removeOverflow = () => {
        let diceMinMaxObj = getDiceMaxMinObj(this.state.diceToRoll);
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
                        <p>{this.state.diceToRoll}</p>
                    </div>
                    <div className="dice-editor">
                        <DiceEditor currDice={this.state.diceToRoll} setNewDice={this.setNewDice}/>
                    </div>
                </div>
                <div className="encounter-table">
                    <div className="encounter-table-data">
                        <Table headerParam={encounterHeader} dataParam={encounterData} setEncounterIndex={this.setEncounterIndex} url={this.props.url} actionid={this.props.actionid}/>
                    </div>
                    {overflowEncounterData.length>0 && 
                        <div className="encounter-table-overflow">
                            <Table headerParam= {overflowHeader} dataParam={overflowEncounterData} setEncounterIndex={this.setEncounterIndex} url={this.props.url} actionid={this.props.actionid}/>
                        </div>
                    }
                </div>
                {overflowEncounterData.length>0 && 
                    <div className="overflow-editor">
                        <button onClick={this.removeOverflow}>Delete All Overflow</button>
                    </div>
                }
                {encounterData.length>0 && 
                    <div className="roll">
                        <div className="roll-dice">
                            <button onClick={this.handleRollClick}>Roll</button>
                        </div>
                        <div className="roll-result">
                            {this.state.lastResult}
                        </div>
                    </div>
                }
            </div>
        );
    }
}
