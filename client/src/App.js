import React from "react";
import "./assets/scss/main.scss";
import Login from "./components/Login";
import Authorised from "./components/Authorised";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./firebase";

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
