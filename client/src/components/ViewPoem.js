import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from 'react-router-dom';

import { format } from 'date-fns';


import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/Pause';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';


import SliderLabel from './SliderLabel';
import { reconstruct } from '../utils/editorUtils';
import { getOneWork, clearActiveWork } from '../store/works'

const useStyles = makeStyles(theme => ({
    edit: {
        height: 'calc(100vh - 300px)',
        minHeight: 150,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
        borderWidth: 2,
    },
    replayContainer: {
        overflowY: "auto",
        flexGrow: 2,
        overflowWrap: "break-word",
    },
    replayWindow: {
        width: "100%",

        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 25,
        marginTop: 25,
        whiteSpace: 'pre-line',
    },
    controls: {
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        padding: 5,
        backgroundColor: theme.palette.primary.dark,
    },
    slider: {
        color: "rgba(255,255,255,0.9)",
        marginLeft: 15,
        marginRight: 15,
    },
    icons: {
        color: "rgba(255,255,255,0.9)",
    },
}))


const ViewPoem = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { workId } = useParams();

    const title = useSelector(state => state.entities.works.activeWork.title);
    const author = useSelector(state => state.entities.works.activeWork.displayName);
    const changes = useSelector(state => state.entities.works.activeWork.changes);
    const authorId = useSelector(state => state.entities.works.activeWork.userId);
    const datePublished = useSelector(state => state.entities.works.activeWork.datePublished);

    const [playing, setPlaying] = useState(false);
    const [playingInterval, setPlayingInterval] = useState(null);
    const [replayVal, setReplayVal] = useState(0);

    useEffect(() => {
        dispatch(getOneWork(workId));
        return () => dispatch(clearActiveWork())
    }, [workId, dispatch])

    useEffect(() => {
        if (changes) {
            setReplayVal(changes.length)
        }
    }, [changes]);

    useEffect(() => {
        if (changes) {
            if (replayVal >= changes.length) {
                clearInterval(playingInterval)
                setPlaying(false);
            }
        }
    }, [replayVal, playingInterval]);

    const handleClickPlay = () => {
        if (!changes) return;
        clearInterval(playingInterval)
        setPlaying(true);
        if (replayVal >= changes.length) {
            setReplayVal(0)
        }
        const interval = setInterval(() => {
            setReplayVal(replayVal => replayVal + 1)
        }, 100)
        setPlayingInterval(interval);
    }

    const handleClickPause = () => {
        clearInterval(playingInterval);
        setPlaying(false);
    }

    const labelFormatter = (x) => {
        if (changes) {
            return (changes[x]) ? format(new Date(changes[x].t), 'p \n MM/dd') : '';
        } else {
            return ""
        }
    }
    return (
        <>
            <Container maxWidth="md">
                <Grid container direction='column'>
                    <Typography variant='h4'>{title}</Typography>
                    <Typography variant='subtitle' color='textSecondary'>
                        <Link component={NavLink} to={`/author/${authorId}`} color='secondary' variant='h6' gutterBottom>
                            {`by ${author}`}
                        </Link>
                        {(datePublished) ? ` | ${format(new Date(datePublished), 'MM/dd/yyy')}` : ''}
                    </Typography>
                </Grid>
                <Paper className={classes.edit} variant="outlined" >
                    <div className={classes.replayContainer}>
                        <div
                            className={classes.replayWindow}
                            style={{
                                fontSize: '1rem',
                            }}>
                            {reconstruct("", changes, replayVal)}
                        </div>
                    </div>
                </Paper>
                <div className={classes.controls}>
                    {(playing) ? (
                        <IconButton onClick={handleClickPause} size="small">
                            <PauseIcon
                                className={classes.icons} />
                        </IconButton>
                    ) : (
                            <IconButton onClick={handleClickPlay} size="small">
                                <PlayArrowRoundedIcon
                                    className={classes.icons} />
                            </IconButton>
                        )}
                    <Slider
                        className={classes.slider}
                        // autoFocus // to do: get this to focus automatically
                        step={1}
                        min={0}
                        max={(changes) ? changes.length - 1 : 0}
                        value={replayVal}
                        valueLabelDisplay="auto"
                        valueLabelFormat={labelFormatter}
                        ValueLabelComponent={SliderLabel}
                        onChange={(e, val) => setReplayVal(val)}
                    />
                </div>
            </Container>
        </>
    )
}

export default ViewPoem;
