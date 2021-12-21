import "./assets/scss/main.scss";

import Login from "./components/Login";
import Authorised from "./components/Authorised";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import { FirebaseAuthProvider } from "./firebaseContext";
const App = () => {
    return (
        <FirebaseAuthProvider>
            <BrowserRouter>
                <Switch>
                    <Route
                        path='/d'
                        exact
                        component={() => <Login d={true} />}
                    />
                    {
                        <Route
                            path='/authorised'
                            exact
                            component={() => <Authorised />}
                        />
                    }
                    <Route path='/' exact component={() => <Login />} />
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
        </FirebaseAuthProvider>
    );
};

export default App;
