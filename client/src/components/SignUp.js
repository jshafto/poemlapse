import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import { signup } from '../store/authentication';
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
    }
}));

const SignupForm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('')

    const err = useSelector(state => state.errors.auth);


    useEffect(() => {
        return () => dispatch(clearErrors());
    }, [])

    const submitForm = (e) => {
        e.preventDefault();
        dispatch(signup(username, email, password))
    }
    return (
        <Container component='main' maxWidth='xs'>
            <div className={classes.space}>
                <Typography variant='h5'>Create an account</Typography>
                <form onSubmit={submitForm}>
                    {(err) ? (
                        <Typography variant='caption' color='error'>
                            {err}
                        </Typography>
                    ) : (null)}
                    <TextField
                        variant='filled'
                        margin='normal'
                        color='secondary'
                        required
                        fullWidth
                        id='username'
                        label='Username'
                        name='username'
                        autoComplete='username'
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                        className={classes.button}
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='secondary'
                        size='large'>
                        Sign Up
                    </Button>
                    <Link component={NavLink} to='/signin' variant='body2' color='secondary'>
                        Already have an account? Sign in.
                    </Link>
                </form>
            </div>
        </Container>
    );
}
export default SignupForm;
