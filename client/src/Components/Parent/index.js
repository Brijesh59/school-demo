import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Layout from './Layout';
import Dashboard from './Dashboard';
import Student from '../Student';

export default class extends Component {

    state = {
        isParent: true,
    }

    componentDidMount(){
        if(localStorage.getItem("saveStatus") == 0){
            localStorage.setItem("username", this.props.credentials.username);
            localStorage.setItem("password", this.props.credentials.password);
        } 

        if(localStorage.getItem("isParent") === "false"){
            this.setState({
                isParent: false
            })
            // reset the local storage
            localStorage.setItem("isParent", "true");
        } 
    }

    handleChildRender = (username) => {
        localStorage.setItem("isParent", "false");
        localStorage.setItem("student_admissionNo", username);

        //check if valid username & password, then open
        window.open("/");
    }

    render() {
        let credentials = {
            username: localStorage.getItem("student_admissionNo")
        }
        if(this.state.isParent){
            return (
                <Router>
                    <Layout>
                        <Switch>
                            <Route exact path="/dashboard"
                            render={(props) => <Dashboard {...props} handleChildRender={this.handleChildRender} />}
                            /> 
                            <Redirect from='/' to='/dashboard' />
                        </Switch>
                    </Layout> 
                </Router>
            )
        }
        else{
            return (
                <Student credentials={credentials}/>
            )
        }
    }
}
