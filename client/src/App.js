import React, { Component, useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Auth from "./components/auth";
import "./assets/scss/main.scss";
import { UserContext, UserProvider } from "./components/AuthContext";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <>
                <UserProvider>
                    <Auth />
                </UserProvider>
            </>
        );
    }
}

export default App;
