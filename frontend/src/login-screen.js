import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import MainScreen from "./main-screen.js"

export default class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            username: "",
            passwsord: "",
            isLoggedOn: false,
        }
    }
    handleSubmitClick = () => {
        this.setState({isLoggedOn:true})
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
    render () {
        return (
            <div>
                <div className="login">
                    <input name="username" value={ this.state.username } onChange={ this.handleChange } />
                    <input name="password" value={ this.state.passwsord } onChange={ this.handleChange } />
                    <button onClick={this.handleSubmitClick}>Submit</button>
                </div>
                <div className="main-screen">
                    <MainScreen />
                </div>
            </div>
        );
    }
}