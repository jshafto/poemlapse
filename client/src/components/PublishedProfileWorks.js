import React from 'react';
import { useHistory } from 'react-router-dom';

import { format } from 'date-fns';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';




const PublishedProfileWorks = ({ works }) => {
    const history = useHistory();

    const viewWork = (id) => () => {
        history.push(`/works/${id}`)
    }

    return (
            <List  >
                {works.map(work => (
                    <ListItem key={work.id} button onClick={viewWork(work.id)} style={{alignItems: 'flex-start'}}>
                            <ListItemText
                                primary={work.title}
                                secondary={work.displayName}
                                primaryTypographyProps={{variant:'h6'}}
                                secondaryTypographyProps={{variant:'body1'}}/>
                            <Typography
                                variant='subtitle1'
                                color='textSecondary'
                                style={{textAlign: 'right', paddingTop:8}}>
                                    {format(new Date(work.datePublished), 'MMM d, yyyy')}
                            </Typography>
                    </ListItem>
                ))}
            </List>
    );
}

export default PublishedProfileWorks;
