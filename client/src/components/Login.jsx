import { useState, useEffect } from "react";
import GoogleButton from "../assets/img/Google-Button.svg";
import DiscordButton from "../assets/img/Discord-Button.svg";
import WhiteHatBlue from "../assets/img/whitehat-blue.svg";

import {
    signOut,
    getAuth,
    signInWithCustomToken,
    GoogleAuthProvider,
    linkWithPopup,
} from "firebase/auth";

import { Button } from "react-bootstrap";
import { Redirect, useParams } from "react-router-dom";
import axios from "axios";

const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

const handleGoogleLink = (user, setGoogle, setCurrUser, token) => {
    console.log("Google Link");

    if (!token) {
        signOut(auth);
        window.alert("Session Expired");
    }

    linkWithPopup(auth.currentUser, provider)
        .then((result) => {
            user.getIdToken(true).then(async (tk) => {
                await axios
                    .post("http://localhost:5000/signup", {
                        dToken: token,
                        idToken: tk,
                    })
                    .catch((err) => console.log(err.message));
            });
            setGoogle(true);
            setCurrUser(user);
        })
        .catch(function (error) {
            var errorMessage = error.message;
            console.log(errorMessage);
        });
};

const Login = (props) => {
    const [currUser, setCurrUser] = useState(null);
    const [token, setToken] = useState(null); // Discords User Access Token
    const [google, setGoogle] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [redirectAuth, setRedirectAuth] = useState(false);
    let { code } = useParams();

    useEffect(() => {
        setCurrUser(props.user);
    }, [props.user]);

    useEffect(() => {
        if (!!currUser) {
            const providerData = currUser.providerData;
            if (
                providerData.find(
                    ({ providerId }) => providerId === "google.com"
                )
            ) {
                setGoogle(true);
                setTimeout(setRedirectAuth(true), 2000);
            }
            currUser
                .getIdTokenResult()
                .then((idTokenResult) => {
                    if (
                        idTokenResult.claims.provider === "discord.com" &&
                        !google
                    )
                        setToken(idTokenResult.claims.discordAccessToken);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        } else if (props.d === true && !redirect) {
            let tk = null;
            (async () => {
                await axios
                    .get(`http://localhost:5000/getd/`, {
                        withCredentials: true,
                        credentials: "include",
                    })
                    .then((res) => {
                        tk = res.data.tk;
                        if (!!tk) {
                            signInWithCustomToken(auth, tk)
                                .then(() => {
                                    setRedirect(true);
                                })
                                .catch(function (error) {
                                    console.log(error.message);
                                });
                        } else {
                            setRedirect(true);
                        }
                    })
                    .catch((err) => console.log(err.message));
            })();
        }
    }, [code, currUser, google, props, props.user, redirect]);

    return (
        <div className='Auth page'>
            {redirectAuth ? <Redirect to='/authorised' /> : null}
            {redirect ? <Redirect to='/' /> : null}
            <h3>IIIT-P Discord Registration</h3>
            <br />
            <br />
            <br />
            <span id='prompt'>Register with your Institute Mail-ID</span>
            <img src={WhiteHatBlue} className='WhiteHatBlue' alt='' />
            <div className='auth'>
                <Button
                    disabled={!token ? false : true}
                    className={`step discord ${!!token ? "completed" : ""} `}
                    href='http://localhost:5000/dauthurl'>
                    <img src={DiscordButton} alt='' />{" "}
                </Button>
                <Button
                    disabled={!!token && !google ? false : true}
                    onClick={() =>
                        handleGoogleLink(
                            currUser,
                            setGoogle,
                            setCurrUser,
                            token
                        )
                    }
                    className={`step google ${google ? "completed" : ""}`}>
                    <img src={GoogleButton} alt='' />{" "}
                </Button>
                {redirectAuth && `Redirecting...`}
            </div>
        </div>
    );
};

export default Login;
