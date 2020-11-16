import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { getActiveAuthor, clearActiveAuthor } from '../store/authors';
import PublishedProfileWorks from './PublishedProfileWorks';

import { sortWorks } from '../utils/workUtils';

const Profile = () => {
    const { authorId } = useParams();
    const dispatch = useDispatch();


    const displayName = useSelector(state => state.entities.authors.activeAuthor.displayName);
    const username = useSelector(state => state.entities.authors.activeAuthor.username);
    const bio = useSelector(state => state.entities.authors.activeAuthor.bio);
    const works = useSelector(state => Object.values(state.entities.works.byId).sort(sortWorks));
    const saved = useSelector(state => Object.values(state.entities.saved.byId).sort(sortWorks));
    const [selectedTab, setSelectedTab] = useState(0);
    useEffect(() => {
        dispatch(getActiveAuthor(authorId));
        // return () => dispatch(clearActiveAuthor());
    }, [authorId])


    return (
        <Container maxWidth='md'>
            <Grid container >
                <Grid item xs={12} sm={3}>
                    <Typography variant='h4'>{displayName}</Typography>
                    <Typography variant='h6' color='textSecondary'>{`@${username}`}</Typography>
                    <Typography>ABOUT:</Typography>
                    <Typography variant='body1'>{bio}</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Tabs
                        value={selectedTab}
                        onChange={(e, val) => setSelectedTab(val)}
                        indicatorColor='primary'
                    >
                        <Tab style={{ fontSize: "1.3rem" }} label="Works" />
                        <Tab style={{ fontSize: "1.3rem" }} label="Collection" />
                    </Tabs>
                    <div hidden={selectedTab !== 0}>
                        <PublishedProfileWorks works={works} />
                    </div>
                    <div hidden={selectedTab !== 1}>
                        <PublishedProfileWorks works={saved} />
                    </div>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Profile;
