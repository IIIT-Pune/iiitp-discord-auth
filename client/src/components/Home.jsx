import React, { Component } from "react";
import GoogleButton from "../assets/img/Google-Button.svg";
import DiscordButton from "../assets/img/Discord-Button.svg";
import GitButton from "../assets/img/Git-Button.svg";
import WhiteHatBlue from "../assets/img/whitehat-blue.svg";

import { Button } from "react-bootstrap";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="Home page">
                <span id="prompt">Log In with your Institute Mail-ID</span>
                <img src={WhiteHatBlue} className="WhiteHatBlue" alt="" />
                <div className="auth">
                    <Button className="step google disabled completed">
                        <img src={GoogleButton} alt="" />{" "}
                    </Button>
                    <Button className="step discord">
                        <img src={DiscordButton} alt="" />{" "}
                    </Button>
                    <Button className="step git disabled">
                        <img src={GitButton} alt="" />{" "}
                    </Button>
                </div>
            </div>
        );
    }
}

export default Home;
