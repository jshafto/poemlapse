import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useDispatch } from "react-redux";

import { ThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import LoginForm from './components/LoginForm';
import SignUp from './components/SignUp'
import NavBar from './components/NavBar';
import Editor from './components/Editor';
import DraftEditor from './components/DraftEditor';
import LandingOrDashboard from './components/LandingOrDashboard';
import ViewPoem from './components/ViewPoem';
import PoemBrowser from './components/PoemBrowser';
import Profile from './components/Profile'
import Footer from './components/Footer';
import { restoreCSRF } from './store/csrf';
import { themeObj } from './theme'
import { AuthRoute } from './Routes';
import ErrorPage from './components/ErrorPage';
import { loadingUser } from './store/authentication';

const useStyles = makeStyles((theme) => ({
    site: {
        minHeight: 'calc(100vh - 75px)',
    },
}));

function App() {
    const theme = createMuiTheme(themeObj);
    const classes = useStyles();
    const dispatch = useDispatch();



    useEffect(() => {
        dispatch(restoreCSRF());
        dispatch(loadingUser());
    }, []);



    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <div className={classes.site}>
                    <NavBar />
                    <Switch>
                        <Route exact path="/editor" >
                            <Editor />
                        </Route>
                        <Route exact path="/author/:authorId" >
                            < Profile/>
                        </Route>
                        <Route exact path="/drafts/:draftId" >
                            <DraftEditor />
                        </Route>
                        <Route exact path="/works/:workId" >
                            <ViewPoem />
                        </Route>
                        <AuthRoute exact path="/signin" component={LoginForm} />
                        <AuthRoute exact path="/signup" component={SignUp} />
                        <Route exact path="/browse">
                            <PoemBrowser />
                        </Route>
                        <Route exact path="/">
                            <LandingOrDashboard />
                        </Route>
                        <Route path="/">
                            <ErrorPage />
                        </Route>
                    </Switch>
                </div>
                <Footer />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
