import React, { Component } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "dotenv/config";
import { Button } from "react-bootstrap";
import axios from "axios";
// import { UserContext, UserProvider } from "./UserContext";
import { UserContext } from "./UserContext";

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

class WhitehatAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: firebase.auth().currentUser,
            isLoggedIn: firebase.auth().currentUser ? true : false,
            apitoken: localStorage.getItem("githubapitoken"),
            githubUser: {},
        };
        this.handleGoogleLogIn = this.handleGoogleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }
    static contextType = UserContext;

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ userData: user, isLoggedIn: !!user });
            console.log("Current User", firebase.auth().currentUser);
        });
    }

    handleGoogleLogIn = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                var token = result.credential.accessToken;
                var refreshToken = result.refreshToken;
                var user = result.user;
                let x = user.email.split("@")[0];
                let y = user.email.split("@")[1];
                if (
                    isNaN(x.slice(-2)) ||
                    !["cse.iiitp.ac.in", "ece.iiitp.ac.in"].includes(y)
                ) {
                    firebase.auth().signOut();
                    window.alert(
                        "The Email ID is not a valid IIIT Pune student email id. Try again with the right ID"
                    );
                    return;
                }
                (async () => {
                    let res = await axios.post(
                        "http://localhost:5000/googleauth",
                        { gat: token, grt: refreshToken },
                        { headers: { "content-type": "application/json" } }
                    );
                    if (res.data === user.email) {
                        this.setState({
                            isLoggedIn: true,
                            userData: user,
                        });
                        return;
                    }
                    firebase.auth().signOut();
                    window.alert("Login unsuccessful. Identity not verified.");
                })();
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
                console.log(errorCode, errorMessage, email, credential);
            });
    };
    handleLogOut() {
        firebase.auth().signOut();
    }
    handleDiscordLink() {
        console.log("here");
    }
    handleGitLink() {
        var githubProvider = new firebase.auth.GithubAuthProvider();
        firebase
            .auth()
            .currentUser.linkWithPopup(githubProvider)
            .then(function (result) {
                // Accounts successfully linked.
                var credential = result.credential;
                var user = result.user;
                // ...
            })
            .catch(function (error) {
                // Handle Errors here.
                console.log(error);
            });
    }
    render() {
        return (
            <div>
                <div>
                    {firebase.auth().currentUser ? (
                        <span>
                            Welcome {this.state.userData.displayName}
                            <Button
                                variant="primary"
                                className="m-2"
                                onClick={() => this.handleLogOut()}>
                                Log out!
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => this.handleGitLink()}>
                                Link GitHub
                            </Button>
                        </span>
                    ) : (
                        <span>
                            <Button
                                variant="primary"
                                className="m-2"
                                onClick={() => this.handleGoogleLogIn()}>
                                Login
                            </Button>
                        </span>
                    )}
                </div>
            </div>
        );
    }
}

export default WhitehatAuth;
