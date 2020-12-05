import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "dotenv/config";
import "./assets/scss/main.scss";
import Login from "./components/Login";
import Authorised from "./components/Authorised";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";

(function () {
    const api_Key = process.env.REACT_APP_APIKEY;
    const auth_Domain = process.env.REACT_APP_AUTHDOMAIN;
    const project_Id = process.env.REACT_APP_PROJECT_ID;
    const storage_Bucket = process.env.REACT_APP_STORAGE_BUCKET;
    const messaging_SenderId = process.env.REACT_APP_MESSAGESENDERID;
    const app_Id = process.env.REACT_APP_APPID;

    const firebaseConfig = {
        apiKey: api_Key,
        authDomain: auth_Domain,
        projectId: project_Id,
        storageBucket: storage_Bucket,
        messagingSenderId: messaging_SenderId,
        appId: app_Id,
    };
    !firebase.apps.length
        ? firebase.initializeApp(firebaseConfig)
        : firebase.app();
})();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { user: null };
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            user && this.setState({ user: user });
        });
    }
    render() {
        return (
            <>
                <BrowserRouter>
                    <Switch>
                        <Route
                            path="/d"
                            exact={true}
                            component={() => (
                                <Login d={true} user={this.state.user} />
                            )}
                        />
                        {this.state.user && (
                            <Route
                                path="/authorised"
                                exact
                                component={() => (
                                    <Authorised user={this.state.user} />
                                )}
                            />
                        )}
                        <Route
                            path="/"
                            exact
                            component={() => <Login user={this.state.user} />}
                        />
                        <Route
                            path="/404"
                            exact
                            component={() => (
                                <div className="page authorised">
                                    <h3>404 Page Not Found</h3>
                                    <br />
                                    <br />
                                    <Link to="/">Login</Link> and join the
                                    discord server
                                </div>
                            )}
                        />
                        <Redirect to="/404" />
                    </Switch>
                </BrowserRouter>
            </>
        );
    }
}

export default App;
