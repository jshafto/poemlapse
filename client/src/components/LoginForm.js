import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

import { login } from '../store/authentication';
import { clearErrors } from '../store/errors';

const useStyles = makeStyles((theme) => ({
    space: {
        marginTop: 100,
    },
    button: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 15,
        marginBottom: 15
    },
    demo: {
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 15
    }
}));

const LoginForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const err = useSelector(state => state.errors.auth);

    useEffect(() => {
        return () => dispatch(clearErrors());
    }, [])

    const submitForm = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
    }

    const demoLogin = () => {
        dispatch(login('demo@poems.poem', 'apoetrydemohownice'));
        history.push('/');
    }
    return (
        <Container component='main' maxWidth='xs'>
            <div className={classes.space}>
                <Typography variant='h5'>Sign in</Typography>
                <form onSubmit={submitForm}>
                    {(err) ? (
                        <Typography variant="caption" color="error">
                            {err}
                        </Typography>
                    ) : (null)}
                    <TextField
                        variant='filled'
                        margin='normal'
                        color='secondary'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant='filled'
                        margin='normal'
                        color='secondary'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant='filled'
                        className={classes.button}
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        size='large'>
                        Sign In
                    </Button>
                    <Button
                        variant='filled'
                        type='button'
                        className={classes.demo}
                        fullWidth
                        variant='contained'
                        color='primary'
                        size='large'
                        onClick={demoLogin}>
                        Demo User
                    </Button>
                    <Link component={NavLink} to='/signup' variant='body2' color='secondary'>
                        Don't have an account? Sign up
                    </Link>
                </form>
            </div>
        </Container>
    );
}
export default LoginForm;
