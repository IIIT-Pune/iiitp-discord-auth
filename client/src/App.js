import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import gitAuth from "./components/GitAuth";
import Home from "./components/Home";

function App() {
    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route path="/discordauth" component={gitAuth}></Route>
                    {/* <Route exact path="/" component={() => <Home />} /> */}
                </Switch>
            </BrowserRouter>
        </>
    );
}

export default App;
