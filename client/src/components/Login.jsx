import { useContext } from "react";
import GoogleButton from "../assets/img/Google-Button.svg";
import DiscordButton from "../assets/img/Discord-Button.svg";
import WhiteHatBlue from "../assets/img/whitehat-blue.svg";
import GitButton from "../assets/img/Git-Button.svg";

import { Button } from "react-bootstrap";
import { FirebaseAuthContext } from "../firebaseContext";
import OauthPopup from "react-oauth-popup";
import { Redirect } from "react-router-dom";
const Login = () => {
    const {
        curUser: user,
        signInWithGoogle,
        linkGithub,
        providers,
        onCode,
        onClose,
        isDiscordLinked,
    } = useContext(FirebaseAuthContext);

    // console.log(user);

    return (
        <div className='Auth page'>
            {isDiscordLinked && <Redirect to='/authorised' />}
            <h3>IIIT-P Student Authentication</h3>
            <br />
            <br />
            <br />
            {!!user && (
                <div className='user'>
                    <img
                        src={
                            providers?.[1]?.photoURL || providers?.[0]?.photoURL
                        }
                        alt=''
                    />
                    <span id='prompt'>Hello {user?.displayName}</span>
                </div>
            )}
            <br />
            {!providers?.[0] ? (
                <span id='prompt'>Sign In with Google</span>
            ) : !providers?.[1] ? (
                <span id='prompt'>Link with Github</span>
            ) : (
                <span id='prompt'>Sign In with Discord</span>
            )}
            <img src={WhiteHatBlue} className='WhiteHatBlue' alt='' />
            <div className='auth'>
                <Button
                    disabled={!!user}
                    onClick={signInWithGoogle}
                    className={`step google ${!!user ? "completed" : ""}`}>
                    <img src={GoogleButton} alt='' />{" "}
                </Button>
                <Button
                    disabled={!!providers?.[1]}
                    onClick={linkGithub}
                    className={`step git ${
                        !!providers?.[1] ? "completed" : ""
                    }`}>
                    <img src={GitButton} alt='' />{" "}
                </Button>
                <OauthPopup
                    url={
                        "https://discord.com/api/oauth2/authorize?client_id=" +
                        "909745349307019284" +
                        "&redirect_uri=https%3A%2F%2Fiiitpauth.netlify.app%2F&response_type=code&scope=email%20identify%20guilds.join&state=" +
                        user?.uid
                    }
                    onCode={onCode}
                    onClose={onClose}>
                    <Button
                        className={`step discord ${
                            isDiscordLinked ? "completed" : ""
                        } `}>
                        <img src={DiscordButton} alt='' />{" "}
                    </Button>
                </OauthPopup>
            </div>
        </div>
    );
};

export default Login;
