import React from 'react';
import { NavLink } from 'react-router-dom';

import {makeStyles} from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Logo from './Logo';


const useStyles = makeStyles((theme )=> ({
    container: {
        marginLeft: 'auto',
        marginRight:'auto',
        paddingLeft: 16,
        paddingRight: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 960,
    },
    status: {
        fontSize:'4rem',
        color: theme.palette.secondary.main,
    },
    top: {
        fontStyle: 'italic',
        textAlign: 'center',
        color: theme.palette.text.secondary,
        fontSize: '2rem',
        marginBottom: 16,
    },
    subtitle: {
        textAlign: 'center',
        color: theme.palette.text.primary,
        fontSize: '1.2rem',
        marginBottom: 8,
    }
}))

const rand = Math.floor(Math.random()*4);

const ErrorPage = () => {
    const classes=useStyles();
    const headers = [
        'so boundless and bare, the lone and level sands stretch far away...',
        'the 404 page is lovely, dark, and deep...',
        'there is a place where the sidewalk ends...',
        'the 404 page is a fine and private place...'
    ];
    const followup = [
        'Look on my 404 page, ye Mighty, and... then head back to the homepage.',
        `But you probably didn't mean to stop here.`,
        `But this is just a 404 page. Let's go back home.`,
        'But the homepage is much more interesting.'
    ];




    return (
        <div className={classes.container} >
            <div className={classes.status}>404</div>
            <div className={classes.top}>{headers[rand]}</div>
            <div className={classes.subtitle}>{followup[rand]}</div>
            <IconButton
                color='secondary'
                component={NavLink}
                to='/'>
                    <Logo/>
                </IconButton>
        </div>
    )
};


export default ErrorPage;
