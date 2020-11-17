import React, { Component } from "react";
import GoogleButton from "../assets/img/Google-Button.svg";
import DiscordButton from "../assets/img/Discord-Button.svg";
import GitButton from "../assets/img/Git-Button.svg";
import WhiteHatBlue from "../assets/img/whitehat-blue.svg";
import firebase from "firebase/app";
import { Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            isLoggedIn: false,
            discord: false,
            google: false,
            git: false,
            redirect: false,
            redirectHome: false,
        };
        this.handleGoogleLink = this.handleGoogleLink.bind(this);
        this.handleGitLink = this.handleGitLink.bind(this);
    }
    componentDidMount() {
        if (this.props.d === true) {
            let tk = null;
            (async () => {
                await axios
                    .get("http://localhost:5000/getd", {
                        withCredentials: true,
                        credentials: "include",
                    })
                    .then((res) => {
                        tk = res.data.tk;
                    });
                if (!!tk) {
                    firebase
                        .auth()
                        .signInWithCustomToken(tk)
                        .then(() => {
                            console.log("User logged in from discord");
                            this.setState({
                                discord: true,
                            });
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(() => this.setState({ redirect: true }));
                }
            })();
        }
        firebase.auth().onAuthStateChanged((user) => {
            if (!!user) {
                user.getIdTokenResult()
                    .then((idTokenResult) => {
                        if (idTokenResult.claims.provider === "discord.com") {
                            this.setState({
                                discord: true,
                            });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                const providerData = user.providerData;
                const update = () => {
                    this.setState({
                        redirectHome: true,
                    });
                };
                if (providerData.length === 2) {
                    this.setState({ step: 3, google: true, git: true });
                    setTimeout(update, 2000);
                } else if (
                    providerData.find(
                        ({ providerId }) => providerId === "google.com"
                    )
                ) {
                    this.setState({
                        google: true,
                    });
                }
            }
        });
    }
    handleGoogleLink = () => {
        console.log("Google Link");
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
        firebase
            .auth()
            .currentUser.linkWithPopup(provider)
            .then((result) => {
                var user = result.user;
                let x = user.email.split("@")[0];
                let y = user.email.split("@")[1];
                if (
                    isNaN(x.slice(-2)) ||
                    !["cse.iiitp.ac.in", "ece.iiitp.ac.in"].includes(y)
                ) {
                    firebase
                        .auth()
                        .currentUser.unlink("google.com")
                        .then(function () {
                            // Auth provider unlinked from account
                            console.log("User unlinked from google");
                        })
                        .catch(function (error) {
                            // An error happened
                            // ...
                        });
                    window.alert(
                        "The Email ID is not a valid IIIT Pune student email id. Try again with the right ID"
                    );
                    return;
                }
                this.setState({ google: true });
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
                console.log(errorCode, errorMessage, email, credential);
            });
    };
    handleGitLink() {
        console.log("Git Link");
        var githubProvider = new firebase.auth.GithubAuthProvider();
        firebase
            .auth()
            .currentUser.linkWithPopup(githubProvider)
            .then((result) => {
                console.log("Linked Github");
                this.setState({ git: true });
                // request to add user to the discord server here
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    render() {
        return (
            <div className="Auth page">
                {this.state.redirect ? <Redirect to="/login" /> : null}
                {this.state.redirectHome ? <Redirect to="/" /> : null}
                <span id="prompt">Register with your Institute Mail-ID</span>
                <img src={WhiteHatBlue} className="WhiteHatBlue" alt="" />
                <div className="auth">
                    <Button
                        disabled={!this.state.discord ? false : true}
                        className={`step discord ${
                            this.state.discord ? "completed" : ""
                        } `}
                        href="http://localhost:5000/dauthurl">
                        <img src={DiscordButton} alt="" />{" "}
                    </Button>

                    <Button
                        onClick={this.handleGoogleLink}
                        disabled={
                            this.state.discord && !this.state.google
                                ? false
                                : true
                        }
                        className={`step google ${
                            this.state.google ? "completed" : ""
                        }`}>
                        <img src={GoogleButton} alt="" />{" "}
                    </Button>
                    <Button
                        disabled={
                            this.state.discord &&
                            this.state.google &&
                            !this.state.git
                                ? false
                                : true
                        }
                        onClick={this.handleGitLink}
                        className={`step git ${
                            this.state.git ? "completed" : ""
                        }`}>
                        <img src={GitButton} alt="" />
                    </Button>
                </div>
            </div>
        );
    }
}

export default Login;
