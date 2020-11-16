import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { format } from 'date-fns';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';

import { getOwnSavedWorks } from '../store/saved';
import { storeUnsaveWork } from '../store/works'
import { sortWorks } from '../utils/workUtils';

const SavedWorksList = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const works = useSelector(state => Object.values(state.entities.saved.byId).sort(sortWorks));

    const viewWork = (id) => () => {
        history.push(`/works/${id}`)
    }

    useEffect(() => {
        dispatch(getOwnSavedWorks());
    }, []);

    const handleUnsave = (id) => (e) => {
        e.stopPropagation();
        dispatch(storeUnsaveWork(id))
    }


    return (
        <List>
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
                        <Tooltip title='Remove from Collection'>
                            <IconButton size='small' style={{ maxHeight: 30 }} onClick={handleUnsave(work.id)}>
                                <BookmarkIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </ListItem>
            ))}
        </List>
    )
}

export default SavedWorksList;
