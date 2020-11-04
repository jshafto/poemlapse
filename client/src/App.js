import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import UserList from './components/UsersList';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import Editor from './components/Editor';
import { restoreCSRF } from './store/csrf';
import { themeObj } from './theme'
import { ProtectedRoute, AuthRoute } from './Routes';



function App() {
    const theme = createMuiTheme(themeObj);
    const dispatch = useDispatch();



    useEffect(() => {
        dispatch(restoreCSRF());
    }, []);



    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <NavBar />
                <Switch>
                    <ProtectedRoute path="/users" exact={true} component={UserList}/>
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
