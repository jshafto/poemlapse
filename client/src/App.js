import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import UserList from './components/UsersList';
import LoginForm from './components/LoginForm';
import { logout } from './store/authentication';
import { restoreCSRF } from './store/csrf'

import { ProtectedRoute, AuthRoute } from './Routes';


function App() {
    const theme = createMuiTheme();
    const dispatch = useDispatch();
    const currentUserId = useSelector(state => state.authentication.id);


    useEffect(() => {
        dispatch(restoreCSRF());
    }, []);



    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <nav>
                    <ul>
                        <li><NavLink to="/" activeclass="active">Home</NavLink></li>
                        <li><NavLink to="/login" activeclass="active">Login</NavLink></li>
                        <li><a onClick={logout} href="#" activeclass="active">Logout</a></li>
                        <li><NavLink to="/users" activeclass="active">Users</NavLink></li>
                    </ul>
                </nav>
                <Switch>
                    <ProtectedRoute path="/users" exact={true} component={UserList} currentUserId={currentUserId} />
                    <AuthRoute path="/login" component={LoginForm} />
                    <Route path="/">
                        <h1>My Home Page</h1>
                    </Route>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
