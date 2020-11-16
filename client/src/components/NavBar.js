import React, { useState } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import MenuList from '@material-ui/core/MenuList'


import Logo from './Logo';
import fullLogo from '../images/full_logo.png'
import { logout } from '../store/authentication';


const useStyles = makeStyles(theme => ({
    app: {
        backgroundColor: theme.palette.background.default,
    },
    bar: {
        justifyContent: 'space-between',
        minHeight: 64,
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
    listItems: {
        fontSize: '1.2rem',
        fontWeight: '600',
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
    },
    menu: {
        backgroundColor: theme.palette.background.default,

        "&:focus": {
            outline: "none"
        },
    }
}))


const NavBar = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const pos = location.pathname === '/browse' ? 'sticky' : 'static';
    const elev = location.pathname === '/browse' ? 1 : 0;
    const [anchorEl, setAnchorEl] = useState(null);


    const loggedOut = useSelector(state => !state.authentication.id)
    const userId = useSelector(state => state.authentication.id)
    const handleLogout = () => {
        setAnchorEl(null)
        dispatch(logout());
        history.push('/');
    }
    if (location.pathname === "/" && loggedOut) {
        return null;
    }

    const openMenu = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }


    return (
        <AppBar
            color='transparent'
            elevation={elev}
            position={pos}
            className={classes.app}>
            <Toolbar className={classes.bar}>
                <Hidden xsDown>
                    <NavLink to="/" className={classes.logo} />
                </Hidden>
                <Hidden smUp>
                    <IconButton component={NavLink} to="/" >
                        <Logo />
                    </IconButton>
                </Hidden>

                {(!loggedOut) ? (
                    <div className={classes.others}>
                        <IconButton className={classes.button} component={NavLink} to={`/author/${userId}`}>
                            <AccountCircleIcon />
                        </IconButton>
                        <IconButton onClick={openMenu}>
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            disablePadding
                            anchorEl={anchorEl}
                            // keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                className: classes.menu
                              }}>
                            <MenuList className={classes.menu} disablePadding>
                                <MenuItem onClick={handleClose} component={NavLink} to='/editor' className={classes.listItems}>Demo</MenuItem>
                                <MenuItem onClick={handleClose} component={NavLink} to='/browse' className={classes.listItems}>Browse</MenuItem>
                                <MenuItem className={classes.listItems} onClick={handleLogout}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                ) : (
                        <div className={classes.others}>
                            <Button component={NavLink} to='/editor' className={classes.button}>Demo</Button>
                            <Button component={NavLink} to='/browse' className={classes.button}>Browse</Button>
                            <Button component={NavLink} to="/signin" className={classes.button}>Sign In</Button>
                            <Button component={NavLink} to="/signup" className={classes.button}>Join</Button>
                        </div>

                    )}
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;
