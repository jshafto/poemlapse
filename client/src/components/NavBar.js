import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authentication';

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    bar: {
        position: 'static',
        display: 'flex',
        width: '100%',
        padding: 10,
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        fontSize: '1rem',
        borderRadius: 5,
        '&:hover': {
            backgroundColor: 'lightgray'
        }
    },
    buttonContainer: {
        marginRight: 5,
        marginLeft: 5,
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
        <nav className={classes.bar}>

            <div className={classes.buttonContainer}>
                <NavLink to="/">
                    <button className={classes.button}>Home</button>
                </NavLink>
            </div>
            <div className={classes.others}>
                <div className={classes.buttonContainer}>
                    <NavLink to="/users">
                        <button className={classes.button}>Users</button>
                    </NavLink>
                </div>
                {(loggedOut) ? (
                    <div className={classes.buttonContainer}>
                        <NavLink to="/login">
                            <button className={classes.button}>Login</button>
                        </NavLink>
                    </div>
                ) : (
                        <div className={classes.buttonContainer}>
                            <button className={classes.button} onClick={handleLogout}>Logout</button>
                        </div>
                    )
                }

            </div>
        </nav>
    )
}

export default NavBar;
