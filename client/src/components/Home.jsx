import React, { Component } from "react";
import { Redirect } from "react-router";
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false };
    }
    render() {
        return <div className="Home">Home</div>;
    }
}

export default Home;
