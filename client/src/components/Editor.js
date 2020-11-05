import React, { useEffect, useState } from 'react';

import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Slider from '@material-ui/core/Slider';
import EditIcon from '@material-ui/icons/Edit';
import HistoryIcon from '@material-ui/icons/History';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/Pause';
import AddIcon from '@material-ui/icons/Add';


const useStyles = makeStyles(theme => ({
    title: {
        marginBottom: 15,
    },
    edit: {
        height: 'calc(100vh - 150px)',
        minHeight: 150,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    textWindow: {
        border: "none",
        width: "100%",
        flexGrow: 2,
        resize: "none",
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom:25,
        "&:focus": {
            outline: "none"
        },
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
        marginBottom:25,
        whiteSpace: 'pre-line',
        verticalAlign: "top"
    },
    editorButtons: {
        paddingTop: 10,
        paddingLeft:10,
        paddingRight: 10,
        display: 'flex',
        justifyContent: 'flex-end'
    },
    buttonGroup: {
        backgroundColor: theme.palette.primary.main,
        outline: "none",
        border: "none",
        borderRadius: 32,
        margin: 5,
    },
    grouped: {
        border: "none",
        borderRadius: 32,
    },
    controls: {
        margin: 20,
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
    }
}))


const step = (initial, change) => {
    const endingIndex = initial.length - change.end
    return initial.slice(0, change.front) + change.inserted + initial.slice(endingIndex)
}

const compareStrings = (str, next) => {
    let inserted = "";
    let front = 0;
    let end = 0;
    if (str === next) return { inserted, front, end: 0 }
    while (str[front] === next[front] && front < str.length) {
        front = front + 1;
    }
    // you could definitely do this just by shortening the while loop but okay
    let choppedStr = str.slice(front)
    let choppedNext = next.slice(front)
    while (choppedStr[choppedStr.length - end - 1] === choppedNext[choppedNext.length - end - 1] && end < choppedStr.length) {
        end = end + 1;
    }

    inserted = next.slice(front, next.length - end);
    return { inserted, front, end }
}

const reconstruct = (initial, changes, index) => {
    return changes.slice(0, index).reduce((acc, val) => step(acc, val), initial)
}

const fonts = {
    default: `"Nunito Sans", "Futura", "Helvetica", sans-serif`,
}

const Editor = () => {
    const classes = useStyles();
    const textSizes = [".6rem", ".8rem", "1rem", "1.2rem", "1.4rem"];
    const [title, setTitle] = useState("poem")
    const [changes, setChanges] = useState([]);
    const [editingTitle, setEditingTitle] = useState(false);
    const [poemField, setPoemField] = useState("");
    const [textSize, setTextSize] = useState(2);
    const [replayVal, setReplayVal] = useState(changes.length);
    const [editMode, setEditMode] = useState(true);
    const [editorFont, setEditorFont] = useState("default");
    const [playing, setPlaying] = useState(false);
    const [playingInterval, setPlayingInterval] = useState(null);


    const handleClickPlay = () => {
        clearInterval(playingInterval)
        setPlaying(true);
        // let first = true;
        if (replayVal>=changes.length) {
            setReplayVal(0)
        }
        const interval = setInterval(() => {
            setReplayVal(replayVal => replayVal+1)
        }, 100)
        setPlayingInterval(interval);
    }

    const handleClickPause = () => {
        clearInterval(playingInterval);
        setPlaying(false);
    }


    const updateEditMode = (e, mode) => {
        if (mode !== null) {
            setEditMode(mode)
        }
        if (playingInterval) {
            clearInterval(playingInterval)
        }
    }

    const handleUpdate = (e) => {
        setChanges([...changes, compareStrings(poemField, e.target.value)]);
        setPoemField(e.target.value);
    }

    useEffect(() => {
        if (replayVal>=changes.length) {
            clearInterval(playingInterval)
            setPlaying(false);
        }
    }, [replayVal, playingInterval])


    return (
        <Container maxWidth="md">
            {(editingTitle) ? (
                <ClickAwayListener onClickAway={() => setEditingTitle(false)}>
                    <TextField
                        className={classes.title}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onBlur={() => setEditingTitle(false)}
                    />
                </ClickAwayListener>
            ) : (
                    <Typography
                        className={classes.title}
                        variant="h6"
                        onClick={() => setEditingTitle(true)}>
                        {title}
                    </Typography>
                )}
            <Paper className={classes.edit} variant="outlined">
                <div className={classes.editorButtons}>
                    <IconButton size="small">
                        <>
                    </IconButton>
                    <ToggleButtonGroup
                    size="small"
                        value={editMode}
                        exclusive
                        onChange={updateEditMode}
                        className={classes.buttonGroup}
                    >
                        <ToggleButton value={true} className={classes.grouped}>
                            <EditIcon className={classes.icons} />
                        </ToggleButton>
                        <ToggleButton onClick={() => setReplayVal(changes.length)} value={false} className={classes.grouped}>
                            <HistoryIcon className={classes.icons}/>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {(editMode) ? (
                    <textarea
                        className={classes.textWindow}
                        value={poemField}
                        onChange={handleUpdate}
                        style={{
                            fontSize: textSizes[textSize],
                            fontFamily: fonts[editorFont],
                        }} />
                ) : (
                        <div className={classes.replayContainer}>
                            <div
                                className={classes.replayWindow}
                                style={{
                                    fontSize: textSizes[textSize],
                                    fontFamily: fonts[editorFont],
                                }}>
                                {reconstruct("", changes, replayVal)}
                            </div>
                        </div>
                    )}
            {(!editMode) ? (
                <div className={classes.controls}>
                    {(playing) ? (
                        <IconButton onClick={handleClickPause} size="small">
                            <PauseIcon
                            className={classes.icons}/>
                        </IconButton>
                    ) : (
                    <IconButton onClick={handleClickPlay} size="small">
                        <PlayArrowRoundedIcon
                            className={classes.icons}/>
                    </IconButton>
                    )}
                    <Slider
                        className={classes.slider}
                        // autoFocus // to do: get this to focus automatically
                        step={1}
                        min={0}
                        max={changes.length}
                        value={replayVal}
                        onChange={(e, val) => setReplayVal(val)}
                        />
                </div>
            ) : (null)}
            </Paper>
        </Container>
    )
}

export default Editor;
