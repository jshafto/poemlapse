import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';


import { getActiveAuthor, clearActiveAuthor } from '../store/authors';
import { updateUserInfo } from '../store/authentication';
import PublishedProfileWorks from './PublishedProfileWorks';

import { sortWorks } from '../utils/workUtils';

const Profile = () => {
    const { authorId } = useParams();
    const dispatch = useDispatch();

    const userId = useSelector(state => state.authentication.id);
    const user = useSelector(state => state.authentication);


    const displayName = useSelector(state => state.entities.authors.activeAuthor.displayName);
    const username = useSelector(state => state.entities.authors.activeAuthor.username);
    const bio = useSelector(state => state.entities.authors.activeAuthor.bio);
    const works = useSelector(state => Object.values(state.entities.works.byId).sort(sortWorks));
    const saved = useSelector(state => Object.values(state.entities.saved.byId).sort(sortWorks));
    const [selectedTab, setSelectedTab] = useState(0);

    const [editingInfo, setEditingInfo] = useState(false);
    const [firstNameField, setFirstNameField] = useState('');
    const [lastNameField, setLastNameField] = useState('');
    const [bioField, setBioField] = useState('');


    useEffect(() => {
        dispatch(getActiveAuthor(authorId));
        return () => dispatch(clearActiveAuthor());
    }, [authorId])

    const handleClickEdit = () => {
        setEditingInfo(true)
        setFirstNameField((user.firstName) ? user.firstName : '')
        setLastNameField((user.lastName) ? user.lastName : '')
        setBioField((user.bio) ? user.bio : '')
    }

    const handleClose = () => {
        setEditingInfo(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserInfo(firstNameField, lastNameField, bioField));
        setEditingInfo(false);
    }

    return (
        <Container maxWidth='md'>
            <Grid container >
                <Grid item xs={12} sm={3}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant='h4'>{displayName}</Typography>
                        {(userId === parseInt(authorId)) ? (
                            <Tooltip title='Edit profile'>
                                <IconButton
                                    style={{ marginRight: 10 }}
                                    onClick={handleClickEdit}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                        ) : (null)}
                    </div>
                    <Typography variant='h6' color='textSecondary'>{`@${username}`}</Typography>
                    {(bio) ? (
                        <Typography>ABOUT:</Typography>
                    ) : (null)}
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
            <Dialog
                open={editingInfo}
                onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex' }}>
                            <TextField
                                style={{ marginRight: 5 }}
                                variant='filled'
                                margin='normal'
                                color='secondary'
                                required
                                fullWidth
                                id='firstName'
                                label='First Name'
                                name='firstName'
                                autoFocus
                                value={firstNameField}
                                onChange={(e) => setFirstNameField(e.target.value)}
                            />
                            <TextField
                                style={{ marginLeft: 5 }}
                                variant='filled'
                                margin='normal'
                                color='secondary'
                                required
                                fullWidth
                                id='lastName'
                                label='Last Name'
                                name='lastName'
                                value={lastNameField}
                                onChange={(e) => setLastNameField(e.target.value)}
                            />
                        </div>
                        <TextField
                            variant='filled'
                            margin='normal'
                            color='secondary'
                            required
                            fullWidth
                            id='bio'
                            label='About'
                            name='bio'
                            rows={3}
                            multiline
                            value={bioField}
                            onChange={(e) => setBioField(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={handleClose} color="secondary">
                            Cancel
                        </Button>
                        <Button variant='contained' onClick={handleSubmit} color="secondary">
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    )
}

export default Profile;
