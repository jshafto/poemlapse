import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar';

import { logout } from '../store/authentication';


const useStyles = makeStyles(theme => ({
    bar: {
        justifyContent: 'space-between',
    },
    button: {
        fontSize: '1.2rem',
        fontWeight: '600',
        marginRight: 5,
        marginLeft: 5,
        '&:hover': {
            backgroundColor: 'transparent',
            fontStyle: 'italic', //possibly not so great, but matches original
        }
    },

    others: {
        display: 'flex',
    }
}))


const NavBar = () => {
    const classes = useStyles();
    const dispatch = useDispatch()

    const loggedOut = useSelector(state => !state.authentication.id)

    const handleLogout = () => dispatch(logout())

    return (
        <AppBar
            color='transparent'
            elevation={0}
            position='static' >
            <Toolbar className={classes.bar}>
                <Button className={classes.button} component={NavLink} to="/">
                    PoemLapse
                </Button>
                <div className={classes.others}>
                    <Button component={NavLink} to='/editor' className={classes.button}>Editor</Button>
                    {(loggedOut) ? (

                        <Button component={NavLink} to="/login" className={classes.button}>Login</Button>
                    ) : (
                            <Button className={classes.button} onClick={handleLogout}>Logout</Button>
                        )
                    }

                </div>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;
