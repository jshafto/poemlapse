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
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';


import SliderLabel from './SliderLabel';
import { reconstruct } from '../utils/editorUtils';
import { getOneWork, clearActiveWork } from '../store/works'

const useStyles = makeStyles(theme => ({
    edit: {
        height: 500,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
        borderWidth: 2,
        width: '100%'
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
        // marginTop: 25,
        whiteSpace: 'pre-line',
    },
    controls: {
        // margin: 20,
        // borderRadius: 4,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
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

const PoemContainer = ({ work }) => {
    const classes = useStyles();

    const title = work.title;
    const author = work.displayName;
    const changes = work.changes;
    const authorId = work.userId;

    const [playing, setPlaying] = useState(false);
    const [playingInterval, setPlayingInterval] = useState(null);
    const [replayVal, setReplayVal] = useState(0);
    const [saved, setSaved] = useState(false);

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

            <Paper className={classes.edit} variant="outlined" >
                <Grid container justify='space-between' direction='row' style={{ padding: 15 }}>
                    <Grid item>
                        <Typography color='textSecondary' variant='subtitle2'>
                        {format(new Date(work.dateCreated), 'MM/dd/yyyy')}
                        </Typography>
                        <Link style={{ fontWeight: 'bold', paddingRight: 5 }} variant='h6' component={NavLink} to={`/works/${work.id}`} color='textPrimary' >
                            {title}
                        </Link>
                        <Link component={NavLink} to={`/author/${authorId}`} color='secondary' variant='h6' gutterBottom>
                            {`by ${author}`}
                        </Link>
                    </Grid>
                    {(saved) ? (
                        <IconButton size='small' onClick={() => setSaved(false)}>
                            <BookmarkIcon onClick={() => setSaved(false)} />
                        </IconButton>
                    ) : (
                            <IconButton size='small' onClick={() => setSaved(true)}>

                                <BookmarkBorderIcon />
                            </IconButton>
                        )}
                </Grid>
                <div className={classes.replayContainer}>
                    <div
                        className={classes.replayWindow}
                        style={{
                            fontSize: '1rem',
                        }}>
                        {reconstruct("", changes, replayVal)}
                    </div>
                </div>
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
            </Paper>
        </>
    )
}

export default PoemContainer;
