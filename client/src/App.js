import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "./assets/scss/main.scss";
import Login from "./components/Login";
import "./assets/scss/main.scss";
import firebase from "firebase/app";
import "firebase/auth";
import "dotenv/config";
import { Button } from "react-bootstrap";

(function () {
    const api_Key = process.env.REACT_APP_APIKEY;
    const auth_Domain = process.env.REACT_APP_AUTHDOMAIN;
    const database_URL = process.env.REACT_APP_DATABASE_URL;
    const project_Id = process.env.REACT_APP_PROJECT_ID;
    const storage_Bucket = process.env.REACT_APP_STORAGE_BUCKET;
    const messaging_SenderId = process.env.REACT_APP_MESSAGESENDERID;
    const app_Id = process.env.REACT_APP_APPID;

    const firebaseConfig = {
        apiKey: api_Key,
        authDomain: auth_Domain,
        databaseURL: database_URL,
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
        this.state = { userData: null };
    }
    componentDidMount() {
        this.setState({ userData: firebase.auth().currentUser });
    }
    render() {
        return (
            <>
                <BrowserRouter>
                    {/* {Navigation} */}
                    <Switch>
                        <Route
                            path="/leaderboard"
                            render={() => <>Leaderboard</>}
                        />
                        <Route
                            path="/profile"
                            exact
                            render={() => <>profile. </>}
                        />
                        <Route
                            path="/login/d/"
                            component={() => <Login d={true} />}
                        />
                        <Route
                            path="/login"
                            exact
                            component={() => <Login />}
                        />
                        <Route path="/" exact component={() => <>Home</>} />
                        {/* Redirect to root if location is not found */}
                        <Route
                            path="/404"
                            exact
                            component={() => <>404 Page Not Found</>}
                        />
                        <Redirect to="/404" />
                    </Switch>
                </BrowserRouter>
                <Button className="m-2" href="/login">
                    Login
                </Button>
                <Button
                    className="m-2"
                    onClick={() => firebase.auth().signOut()}>
                    Sign Out
                </Button>
            </>
        );
    }
}

export default App;
