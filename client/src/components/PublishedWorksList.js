import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { format } from 'date-fns';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { getOwnWorks, unpublishWork } from '../store/works';
import { sortWorks } from '../utils/workUtils';



const PublishedWorksList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [revertOpen, setRevertOpen] = useState(false);
    const [revertingId, setRevertingId] = useState(null);

    const works = useSelector(state => Object.values(state.entities.works.byId).sort(sortWorks));

    const viewWork = (id) => () => {
        history.push(`/works/${id}`)
    }

    useEffect(() => {
        dispatch(getOwnWorks());
    }, [])


    const revertPublicationOpen =(id, title) => (e) => {
        e.stopPropagation();
        setRevertOpen(true);
        setRevertingId({id, title})
    }

    const handleRevertPublication = (id) => () => {
        dispatch(unpublishWork(id));
        setRevertOpen(false);
        setRevertingId(null);
    }

    const handleCloseRevert = () => {
        setRevertingId(null);
        setRevertOpen(false);
    }

    return (
        <List>
            {(revertOpen) ? (
                <Dialog open={revertOpen} onClose={handleCloseRevert}>
                    <DialogTitle>{`Are you sure you would like to revert publication of "${revertingId.title}"?`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`If you proceed, "${revertingId.title}" will be returned to your drafts, and will no longer be available as a published work.`}
                        </DialogContentText>
                        <DialogActions>
                            <Button
                                elevation={0}
                                onClick={handleCloseRevert}
                                variant="outlined"
                                >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRevertPublication(revertingId.id)}
                                variant='contained'
                                color='primary'
                                >
                                Revert publication
                            </Button>

                        </DialogActions>
                    </DialogContent>
                </Dialog>
                ) : (null)}
            {works.map(work => (
                <ListItem key={work.id} button onClick={viewWork(work.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '90%' }}>
                            <Typography variant='h6'>{work.title}</Typography>
                            <Typography variant='caption' color='textSecondary'>{`Published: ${format(new Date(work.datePublished), 'MMM d, yyyy')}`}</Typography>
                            <Typography
                                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 10 }}
                                color='textSecondary'
                                variant='body2'>
                                {work.beginning}
                            </Typography>
                        </div>
                        <Tooltip title='Revert Publication'>
                            <IconButton
                                size='small'
                                style={{ maxHeight: 30 }}
                                onClick={revertPublicationOpen(work.id, work.title)} >
                                <HighlightOffIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </ListItem>
            ))}
        </List>
    )
}

export default PublishedWorksList;
