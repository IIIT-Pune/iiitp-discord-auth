import React, { useEffect, useState } from "react";
import axios from "axios";
import "./assets/scss/main.scss";
import "./firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider,
    linkWithPopup,
    getIdToken,
} from "firebase/auth";
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

const githubProvider = new GithubAuthProvider();

const FirebaseAuthContext = React.createContext({
    curUser: {},
    auth: {},
});

const FirebaseAuthProvider = ({ children }) => {
    const [curUser, setCurUser] = useState(null);
    const [providers, setProviders] = useState([]);
    const [auth, setAuth] = useState();
    const [isDiscordLinked, setIsDiscordLinked] = useState(false);
    useEffect(() => {
        (async () => {
            const { getAuth } = await import("firebase/auth");

            const auth = getAuth();
            setAuth(auth);
        })();
    }, []);
    useEffect(() => {
        if (auth) {
            (async () => {
                const { onAuthStateChanged } = await import("firebase/auth");
                onAuthStateChanged(auth, (user) => {
                    setCurUser(user);
                    setProviders(user?.providerData);

                    user.getIdTokenResult()
                        .then((idTokenResult) => {
                            const claims = idTokenResult.claims;
                            console.log(claims);
                            if (claims.discord_id) {
                                console.log("discord is linked");
                                setIsDiscordLinked(true);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    if (user) console.log("User Signed In");
                    else console.log("User Signed out");
                });
            })();
        }
    }, [auth]);
    const signInWithGoogle = async () => {
        signInWithPopup(auth, provider).catch((error) => {
            console.log("Error", error);
        });
    };
    const linkGithub = async () => {
        linkWithPopup(auth.currentUser, githubProvider)
            .then((result) => {
                // Accounts successfully linked.
                console.log("Github Linked", result);
                setCurUser(result.user);
                setProviders(result.user.providerData);
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };
    const onCode = async (code) => {
        // console.log("code", code);
        const idToken = await getIdToken(auth.currentUser);
        axios
            .post("https://iiitpauth.herokuapp.com/discordauth", {
                code,
                idToken,
            })
            .then((res) => {
                console.log("res", res);
                curUser
                    .getIdTokenResult()
                    .then((idTokenResult) => {
                        const claims = idTokenResult.claims;
                        console.log(claims);
                        if (claims.discord_id) {
                            console.log("discord linked");
                            setIsDiscordLinked(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch(async (err) => {
                window.alert(err.message);
                console.log("err", err);
            });
    };
    const onClose = () => {
        console.log("pop up closed");
    };
    return (
        <FirebaseAuthContext.Provider
            value={{
                curUser,
                auth,
                signInWithGoogle,
                linkGithub,
                onCode,
                onClose,
                providers,
                isDiscordLinked,
            }}>
            {children}
        </FirebaseAuthContext.Provider>
    );
};

export { FirebaseAuthContext, FirebaseAuthProvider };
