import React from "react";
import "./assets/scss/main.scss";
import Login from "./components/Login";
import Authorised from "./components/Authorised";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";

(function () {
    const api_Key = process.env.REACT_APP_APIKEY;
    const auth_Domain = process.env.REACT_APP_AUTHDOMAIN;
    const project_Id = process.env.REACT_APP_PROJECT_ID;
    const storage_Bucket = process.env.REACT_APP_STORAGE_BUCKET;
    const messaging_SenderId = process.env.REACT_APP_MESSAGESENDERID;
    const app_Id = process.env.REACT_APP_APPID;

const auth = getAuth();

const App = () => {
    const [curUser, setCurUser] = useState(auth.currentUser);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurUser(auth.currentUser);

            if (user) console.log("User Signed In");
            else console.log("User Signed out");
        });
    }, []);

    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route
                        path='/d/:code'
                        exact
                        component={() => <Login d={true} user={curUser} />}
                    />
                    {curUser && (
                        <Route
                            path='/authorised'
                            exact
                            component={() => <Authorised user={curUser} />}
                        />
                    )}
                    <Route
                        path='/'
                        exact
                        component={() => <Login user={curUser} />}
                    />
                    <Route
                        path='/404'
                        exact
                        component={() => (
                            <div className='page authorised'>
                                <h3>404 Page Not Found</h3>
                                <br />
                                <br />
                                <Link to='/'>Login</Link> and join the discord
                                server
                            </div>
                        )}
                    />
                    <Redirect to='/404' />
                </Switch>
            </BrowserRouter>
        </>
    );
};

export default App;
