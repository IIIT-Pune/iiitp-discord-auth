import React, { Component } from "react";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import WhitehatAuth from "./components/Auth";
import "./assets/scss/main.scss";
import Home from "./components/Home";
import "./assets/scss/main.scss";
// import { UserProvider, UserContext } from "./components/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <>
                {/* <WhitehatAuth /> */}
                <Home />
            </>
        );
    }
}

export default App;
