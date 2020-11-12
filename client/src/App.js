import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import { useDispatch } from "react-redux";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import UserList from './components/UsersList';
import LoginForm from './components/LoginForm';
import SignUp from './components/SignUp'
import NavBar from './components/NavBar';
import Editor from './components/Editor';
import DraftEditor from './components/DraftEditor';
import LandingOrDashboard from './components/LandingOrDashboard'
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
                    <Route exact path="/editor" >
                        <Editor />
                    </Route>
                    <Route path="/drafts/:draftId" >
                        <DraftEditor />
                    </Route>
                    <AuthRoute path="/signin" component={LoginForm} />
                    <AuthRoute path="/signup" component={SignUp} />
                    <Route path="/">
                        <LandingOrDashboard />
                    </Route>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
