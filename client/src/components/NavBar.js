import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden'
import Logo from './Logo';

import fullLogo from '../images/full_logo.png'
import { logout } from '../store/authentication';


const useStyles = makeStyles(theme => ({
    bar: {
        justifyContent: 'space-between',
        minHeight:64,
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
    logo: {
        backgroundImage: `url(${fullLogo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        width: 90,
        height: 48,
        borderRadius: 16,
    },
    others: {
        display: 'flex',
    }
}))


const NavBar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();

    const loggedOut = useSelector(state => !state.authentication.id)

    const handleLogout = () => dispatch(logout())

    if (location.pathname === "/" && loggedOut) {
        return null;
    }

    return (
        <AppBar
            color='transparent'
            elevation={0}
            position='static' >
            <Toolbar className={classes.bar}>
                <Hidden xsDown>
                    <NavLink to="/" className={classes.logo} />
                </Hidden>
                <Hidden smUp>
                <IconButton component={NavLink} to="/" >
                    <Logo />
                </IconButton>
                </Hidden>

                <div className={classes.others}>
                    <Button component={NavLink} to='/editor' className={classes.button}>Demo</Button>
                    {(loggedOut) ? (<Button component={NavLink} to="/signup" className={classes.button}>Join</Button>
                    ) : (null)}
                    {(loggedOut) ? (

                        <Button component={NavLink} to="/signin" className={classes.button}>Sign In</Button>
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
