import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import logo from '../images/full_logo_pink.png';
import { landingTypingArr } from '../images/landing_animation';

const useStyles = makeStyles(theme => ({
    topSpacing: {
        marginTop: 100,
        width: '100%',
    },
    topSpacingSM: {
        marginTop: '15vw',
        width: '100%',
    },
    logo: {
        backgroundImage: `url(${logo})`,
        width: '100%',
        height: 200,
        minWidth: 100,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        cursor: 'pointer'
    },
    typing: {
        marginTop: 15,
        width: 700,
        height: 70,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
    },
    gif: {
        marginTop: 15,
        marginBottom: 15,
        overflow: 'hidden',
    },
    navButtons: {
        marginTop:10,
        marginLeft: 10,
        color: "rgba(255,255,255,0.9)",
        fontWeight: 'bold',
        fontSize: '1.2rem'
    },
    skip: {
        marginTop:10,
        fontWeight: 'bold',
        fontSize: '1.2rem'
    }
}))

const Landing = () => {
    const classes = useStyles();
    const [imInd, setImInd] = useState(0);
    const [finished, setFinished] = useState(false);
    const history = useHistory();

    const fastForward = () => {
        setFinished(true)
        setImInd(landingTypingArr.length - 1)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setImInd(ind => {
                if (ind >= landingTypingArr.length - 1) {
                    clearInterval(interval);
                    setFinished(true);
                    return landingTypingArr.length - 1;
                }
                return ind + 1;
            })
        }, 150)
    }, [])



    return (
        <>
            <Container maxWidth="sm">
                <Hidden xsDown>
                    <div className={classes.topSpacing} />
                </Hidden>
                <Hidden smUp>
                    <div className={classes.topSpacingSM} />
                </Hidden>
                <div
                    onClick={() => history.push('/browse')}
                    to='/browse'
                    className={classes.logo}
                />

            </Container>
            <Container
                maxWidth="sm"
                className={classes.gif}>
                <Paper
                    onClick={fastForward}
                    elevation={0}
                    variant="outlined"
                    style={{
                        overflow: 'hidden',
                        cursor: (!finished) ? 'pointer' : 'auto'
                    }}>
                    <div
                        className={classes.typing}
                        style={{ backgroundImage: `url(${landingTypingArr[imInd]})` }}
                    />
                </Paper>
                <Grid container justify='flex-end'>
                    {(!finished) ? (
                        <Button
                            className={classes.skip}
                            color='secondary'
                            onClick={fastForward}>
                            Skip <SkipNextIcon />
                        </Button>
                    ) : (
                        <>
                            <Button
                                disableElevation
                                className={classes.navButtons}
                                component={NavLink}
                                to='/editor'
                                variant='contained'
                                color='primary'
                                > Demo
                            </Button>
                            <Button
                                disableElevation
                                className={classes.navButtons}
                                component={NavLink}
                                to='/browse'
                                variant='contained'
                                color='primary'
                                > Read
                            </Button>
                            <Button
                                disableElevation
                                className={classes.navButtons}
                                component={NavLink}
                                to='/signup'
                                variant='contained'
                                color='primary'
                                > Get Started
                            </Button>
                        </>
                        )}
                </Grid>
            </Container>
            <Container maxWidth="md"
                style={{
                    visibility: (finished) ? 'visible' : 'hidden',
                    opacity: (finished) ? 1 : 0,
                    transition: 'visibility 0s, opacity 1s linear'
                }}>
                <Typography variant='h6'>
                    PoemLapse is a platform for
                    poets and poetry-lovers to experience
                    poetry chronologically, from the first keystroke
                    to the final draft. It's based on the software behind the
                        digital poetry journal, <Link
                        color='secondary'
                        target="_blank"
                        href='http://midst.press'>Midst</Link>.
                </Typography>
                <Typography color='secondary' variant='h3' align='center' gutterBottom>
                    ...
                </Typography>
                <Typography variant='h6'>
                    Using PoemLapse, you can write poems and replay your process in the editor.
                    Work on drafts, and publish them for your followers to view.
                    Follow other poets and browse recent works.
                </Typography>
                <Typography color='secondary' variant='h3' align='center' gutterBottom>
                    ...
                </Typography>
                <Typography variant='h6' >
                    The Poemlapse app is just a demo, but
                    if you'd like to see real poetry in process,
                        check out <Link
                        color='secondary'
                        target='_blank'
                        href='http://midst.press'>Midst</Link>.
                        Midst is a digital journal that publishes poems
                        in the form of interactive timelapses.
                        You can explore Midst's <Link
                        color='secondary'
                        target='_blank'
                        href='http://midst.press/read'>issues</Link> and learn more at their website.
                        You can also support Midst by becoming a <Link
                        color='secondary'
                        target='_blank'
                        href='https://www.patreon.com/midstpoetry'>patron</Link>.
                    This demo was created with permission from the Midst team,
                although it is not affiliated with the project. I am grateful for their
                generosity in letting me play with their beautiful concept.
                </Typography>
            </Container>
            {/* </Box> */}
        </>
    )
}

export default Landing;
