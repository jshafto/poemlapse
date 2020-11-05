import React, { useState } from 'react';

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

const useStyles = makeStyles(theme => ({
    title: {
        marginBottom: 15,
    },
    textWindow: {
        border: "none",
        width: "100%",
        resize: "none",
        padding: 10,
        "&:focus": {
            outline: "none"
        },
        height: 450,
    },
    replayWindow: {
        width: "100%",
        padding: 10,
        height: 450,
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
    console.log({ inserted, front, end })
    return { inserted, front, end }
}

const reconstruct = (initial, changes, index) => {
    return changes.slice(0, index).reduce((acc, val) => step(acc, val), initial)
}

const Editor = () => {
    const classes = useStyles();
    const textSizes = [".6rem", ".8rem", "1rem", "1.2rem", "1.4rem"];
    const [title, setTitle] = useState("poem")
    const [editingTitle, setEditingTitle] = useState(false);
    const [changes, setChanges] = useState([]);
    const [poemField, setPoemField] = useState("");
    const [textSize, setTextSize] = useState(2);
    const [replayVal, setReplayVal] = useState(changes.length);
    const [editorMode, setEditorMode] = useState("edit");



    const handleUpdate = (e) => {
        setChanges([...changes, compareStrings(poemField, e.target.value)]);
        setPoemField(e.target.value);
        console.log(changes)

    }


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
                        onDoubleClick={() => setEditingTitle(true)}>
                        {title}
                    </Typography>
                )}
            <Paper className={classes.edit} variant="outlined">
                <div className={classes.editorButtons}>
                    <ToggleButtonGroup
                        value={editorMode}
                        exclusive
                        onChange={(e, mode) => setEditorMode(mode)}
                    >
                        <ToggleButton value="edit">
                            <EditIcon />
                        </ToggleButton>
                        <ToggleButton value="replay">
                            <HistoryIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <textarea
                    rows="30"
                    className={classes.textWindow}
                    value={poemField}
                    onChange={handleUpdate}
                    style={{ fontSize: textSizes[textSize] }} />
            </Paper>
            <div>
                {reconstruct("", changes, replayVal)}
            </div>
            <Slider
                step={1}
                min={0}
                max={changes.length}
                value={replayVal}
                onChange={(e, val) => setReplayVal(val)}
            />
        </Container>
    )
}

export default Editor;
