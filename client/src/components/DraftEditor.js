import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import { format } from 'date-fns';

import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Slider from '@material-ui/core/Slider';
import EditIcon from '@material-ui/icons/Edit';
import HistoryIcon from '@material-ui/icons/History';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/Pause';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextFormatIcon from '@material-ui/icons/TextFormat';
import PublishIcon from '@material-ui/icons/Publish';

import SliderLabel from './SliderLabel';
import { compareStrings, reconstruct } from '../utils/editorUtils';
import { getActiveDraft, clearActiveDraft, updateDraft } from '../store/drafts';
import { publishWork } from '../store/works'
import { setAutosaved, setNotSaved } from '../store/ui';

const useStyles = makeStyles(theme => ({
    title: {
        marginBottom: 15,
    },
    edit: {
        height: 'calc(100vh - 180px)',
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
        paddingTop: 0,
        paddingLeft: 25,
        paddingRight: 25,
        marginBottom: 25,
        "&:focus": {
            outline: "none"
        },
        lineHeight: 1.4,
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
        whiteSpace: 'pre-line',
    },
    editorButtons: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
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
    fontSizeIcons: {
        backgroundColor: theme.palette.primary.main,
        color: "rgba(255,255,255,0.9)",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
        padding: 6,
        height: 36,
        margin: 5,
    },
    menu: {
        background: theme.palette.background.default,
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
    },
}))



const fonts = [
    { label: "default", val: `"Nunito Sans", "Futura", sans-serif` },
    { label: "sans-serif", val: `"Helvetica", sans-serif` },
    { label: "monospace", val: "monospace" },
    { label: "serif", val: `'EB Garamond', serif` },
]
const textSizes = [".6rem", ".8rem", "1rem", "1.2rem", "1.4rem"];

const DraftEditor = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const { draftId } = useParams();

    const userId = useSelector(state => state.authentication.id);
    const storedTitle = useSelector(state => state.entities.drafts.activeDraft.title);
    const storedChanges = useSelector(state => state.entities.drafts.activeDraft.changes);
    const dateCreated = useSelector(state => state.entities.drafts.activeDraft.date_created);
    const fetchingPublishId = useSelector(state => state.entities.works.fetching);
    const autosaved = useSelector(state => state.ui.autosaved)

    const [titleField, setTitleField] = useState(storedTitle || "")
    const [changes, setChanges] = useState([{inserted:"", front:0, end:0, t:(new Date())}]);
    const [editingTitle, setEditingTitle] = useState(false);
    const [poemField, setPoemField] = useState("");
    const [textSize, setTextSize] = useState(2);
    const [replayVal, setReplayVal] = useState(changes.length);
    const [editMode, setEditMode] = useState(true);
    const [editorFont, setEditorFont] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [playingInterval, setPlayingInterval] = useState(null);
    const [fontMenuAnchor, setFontMenuAnchor] = useState(null);
    const [saveTimeout, setSaveTimeout] = useState(null)


    useEffect(() => {
        if (fetchingPublishId) {
            history.push(`/works/${fetchingPublishId}`)
        }
    }, [fetchingPublishId])


    useEffect(() => {
        dispatch(getActiveDraft(draftId));
        return () => dispatch(clearActiveDraft())
    }, [draftId, dispatch, userId])

    useEffect(() => {
        if (replayVal >= changes.length) {
            clearInterval(playingInterval)
            setPlaying(false);
        }
    }, [replayVal, playingInterval])


    useEffect(() => {
        // when the database's version of the change history updates
        // we want to load those changes into the current page
        // however, if the user has made changes while the database was updating
        // we don't want to overwrite those changes
        // so we only need to load the changes from the database if that history
        // is longer than the current history (e.g. when the poem first loads)
        // if the user's history is more up-to date, we don't want to replace
        // that
        // there may ultimately be a solution less likely to lead to loss of data
        // somehow (what if a user managed to arrive at a page for a document
        // they've already worked on, and then make more changes than
        // they'd previously had and it overwrite the previously existing history??
        // but let's stick with this for now.
        if (storedChanges) {
            const parsedChanges = JSON.parse(storedChanges);
            if (parsedChanges.length > changes.length) {
                setChanges(parsedChanges)
                setPoemField(reconstruct("", parsedChanges, parsedChanges.length))
            }

        }
    }, [storedChanges])

    const handleClickTitle = () => {
        setTitleField(storedTitle);
        setEditingTitle(true);
    }

    const submitNewTitle = (e) => {
        e.preventDefault()
        dispatch(updateDraft(draftId, titleField));
        setEditingTitle(false)
    }

    const handleClickPlay = () => {
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


    const updateEditMode = (e, mode) => {
        if (mode !== null) {
            setEditMode(mode)
        }
        if (playingInterval) {
            clearInterval(playingInterval)
        }
    }

    const updateFont = (index) => {
        setFontMenuAnchor(null);
        setEditorFont(index);
    }
    const saveChanges = (changeList, value) => {
        const beginning = value.slice(0,280);
        dispatch(updateDraft(draftId, null, JSON.stringify(changeList), beginning))
        dispatch(setAutosaved())
    }

    const handleUpdate = (e) => {
        const currentValue = e.target.value;
        const lastChange = compareStrings(poemField, e.target.value);
        const newChanges = [...changes, lastChange];
        clearTimeout(saveTimeout);
        setChanges(newChanges);
        setPoemField(currentValue);
        const timeout = setTimeout(saveChanges, 2000, newChanges, currentValue);
        setSaveTimeout(timeout);
        dispatch(setNotSaved())
    }

    const labelFormatter = (x) => {
        return (changes[x]) ? format(new Date(changes[x].t), 'p \n MM/dd') : '';
    }

    const handlePublish = () => {
        dispatch(publishWork(draftId))
    }

    useEffect(() => {
        return () => {
            if (saveTimeout) {
                saveChanges(changes, poemField);
                clearTimeout(saveTimeout);
                dispatch(setAutosaved());
            }
        }
    }, [])
    return (
        <Container maxWidth="md">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'}}>
            {(editingTitle) ? (
                <ClickAwayListener onClickAway={() => setEditingTitle(false)}>
                    <form onSubmit={submitNewTitle}>
                        <TextField
                            autoFocus
                            className={classes.title}
                            value={titleField}
                            onChange={e => setTitleField(e.target.value)}
                            onBlur={() => setEditingTitle(false)}
                        />
                    </form>
                </ClickAwayListener>
            ) : (
                    <Typography
                        className={classes.title}
                        variant="h6"
                        onClick={handleClickTitle}>
                        {storedTitle}
                    </Typography>
                )}
            {(autosaved) ? (
                <Typography color='textSecondary'style={{fontStyle: 'italic'}}>saved</Typography>
            ) : (
                <Typography color='textSecondary'style={{fontStyle: 'italic'}}>autosaving...</Typography>
            )}
            </div>
            <Paper className={classes.edit} variant="outlined" >
                <div className={classes.editorButtons}>
                    <Tooltip title="Publish">
                        <IconButton
                            className={classes.fontSizeIcons}
                            size="small"
                            onClick={handlePublish}
                            disabled={changes.length<=1}>
                            <PublishIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Decrease Font Size">
                        <IconButton
                            className={classes.fontSizeIcons}
                            size="small"
                            onClick={() => setTextSize(textSize - 1)}
                            disabled={textSize <= 0}>
                            <RemoveIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Increase Font Size">
                        <IconButton
                            className={classes.fontSizeIcons}
                            size="small"
                            onClick={() => setTextSize(textSize + 1)}
                            disabled={textSize >= textSizes.length - 1}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Font...">
                        <IconButton
                            className={classes.fontSizeIcons}
                            size="small"
                            onClick={(e) => setFontMenuAnchor(e.currentTarget)}>
                            <TextFormatIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        MenuListProps={{ className: classes.menu }}
                        elevation={0}
                        anchorEl={fontMenuAnchor}
                        open={Boolean(fontMenuAnchor)}
                        onClose={() => setFontMenuAnchor(null)}
                    >
                        {fonts.map((font, ind) => (
                            <MenuItem
                                // classes={{selected: classes.selected, root: classes.menuItemRoot}}
                                key={ind}
                                selected={ind === editorFont}
                                onClick={() => updateFont(ind)}>
                                {font.label}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Tooltip title="Edit/Replay">
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
                                <HistoryIcon className={classes.icons} />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Tooltip>
                </div>
                {(editMode) ? (
                    <textarea
                        className={classes.textWindow}
                        value={poemField}
                        onChange={handleUpdate}
                        style={{
                            fontSize: textSizes[textSize],
                            fontFamily: fonts[editorFont].val,
                        }} />
                ) : (
                        <div className={classes.replayContainer}>
                            <div
                                className={classes.replayWindow}
                                style={{
                                    fontSize: textSizes[textSize],
                                    fontFamily: fonts[editorFont].val,
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
                            max={changes.length-1}
                            value={replayVal}
                            valueLabelDisplay="auto"
                            valueLabelFormat={labelFormatter}
                            ValueLabelComponent={SliderLabel}
                            onChange={(e, val) => setReplayVal(val)}
                        />
                    </div>
                ) : (null)}
            </Paper>
        </Container>
    )
}

export default DraftEditor;
