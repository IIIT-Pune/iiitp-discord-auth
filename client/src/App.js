import React, { Component, useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import WhitehatAuth from "./components/Auth";
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
                    <WhitehatAuth />
                </UserProvider>
            </>
        );
    }
}

export default App;
