import React from 'react';

import Dashboard from './dashboard';

export default class NewDashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            formData: {
                name: "",
            },
            didSubmit: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.dashboardid = null;
    }
    handleSubmitClick = async e => {
        e.preventDefault();
        try {
            const bodyPostDashboard = { "userid":this.props.userid, "name":this.state.formData.name };
            const responsePostDashboard = await fetch(`http://localhost:5000/dashboard`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(bodyPostDashboard)
            });
            const getDashboardReturn = await responsePostDashboard.json();
            this.dashboardid = getDashboardReturn.dashboardid;
            this.setState({didSubmit:true});
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
                {!this.state.didSubmit && 
                    <form className="new-dashboard" onSubmit={this.handleSubmitClick}>
                        <label>Name
                            <input name="name" type="text" value={ this.state.formData.name } onChange={ this.handleChange } />
                        </label>
                        <button>Submit</button>
                    </form>
                }
                {this.state.didSubmit && 
                    <Dashboard dashboardid={this.dashboardid} userid={this.props.userid}/>
                }
            </div>
        );
    }

}