import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';

import MenuScreen from "./menu-screen";

export default class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            formData: {
                username: "",
                passwsord: ""
            },
            isLoggedOn: false,
        }
        this.userid = null;
        this.handleChange = this.handleChange.bind(this);
    }
    handleSubmitClick = async e => {
        e.preventDefault();
        try {
            const body = { "email":this.state.formData.username, "password":this.state.formData.password };
            const response = await fetch("http://localhost:5000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(body)
            });
            const user = await response.json();
            if(user){
                this.userid=user.userid;
                this.setState({isLoggedOn:true});
            }
        } catch (error) {
            
        }
    }
    handleChange(event) {
        let formData = Object.assign({}, this.state.formData);
        formData[event.target.name] = event.target.value;
        this.setState({formData});
    }
    render () {
        return (
            <div>
                {!this.state.isLoggedOn && 
                    <form className="login" onSubmit={this.handleSubmitClick}>
                        <label>Email
                            <input name="username" type="text" value={ this.state.formData.username } onChange={ this.handleChange } />
                        </label>
                        <label>Passowrd
                            <input name="password" type="password" value={ this.state.formData.password } onChange={ this.handleChange } />
                        </label>
                        <button>Submit</button>
                    </form>
                }
                {this.state.isLoggedOn && 
                    <MenuScreen userid={this.userid}/>
                }
            </div>
        );
    }
}