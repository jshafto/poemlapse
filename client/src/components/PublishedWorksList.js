import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { format } from 'date-fns';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';



import { getOwnWorks } from '../store/works';
import { Typography } from '@material-ui/core';



const PublishedWorksList = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const works = useSelector(state => Object.values(state.entities.works.byId));

    const viewWork = (id) => () => {
        history.push(`/works/${id}`)
    }

    useEffect(() => {
        dispatch(getOwnWorks());
    }, [])

    return (
        <List>
            {works.map(work => (
                <ListItem key={work.id} button onClick={viewWork(work.id)}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant='h6'>{work.title}</Typography>
                            <Typography variant='caption' color='textSecondary'>{`Published: ${format(new Date(work.datePublished), 'MMM d, yyyy')}`}</Typography>
                        </div>
                        <Typography
                            style={{whiteSpace: 'nowrap', overflow: 'hidden',textOverflow: 'ellipsis', marginRight:10}}
                            color='textSecondary'
                            variant='body2'>
                                {work.beginning}
                        </Typography>
                    </div>
                </ListItem>
            ))}
        </List>
    )
}

export default PublishedWorksList;
