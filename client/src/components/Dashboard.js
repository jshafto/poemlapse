import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';



import { newDraft } from '../store/drafts';
import DraftList from './DraftList';
import PublishedWorksList from './PublishedWorksList';
import SavedWorksList from './SavedWorksList';

const Dashboard = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const fetchingDraftId = useSelector(state => state.entities.drafts.fetching);
    const [selectedTab, setSelectedTab] = useState(0)

    useEffect(() => {
        if (fetchingDraftId) {
            history.push(`/drafts/${fetchingDraftId}`)
        }
    }, [fetchingDraftId])



    const createPoem = () => {
        dispatch(newDraft('untitled'))
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4">My poems</Typography>
            <Tooltip title="New Draft">
                <IconButton color="primary" variant="outlined" onClick={createPoem}>
                    <AddCircleOutlineIcon />
                </IconButton>
            </Tooltip>
            <Tabs
                value={selectedTab}
                onChange={(e,val) => setSelectedTab(val)}
                indicatorColor='primary'
                >
                <Tab style={{fontSize: "1.3rem"}} label="Drafts"/>
                <Tab style={{fontSize: "1.3rem"}} label="Published"/>
                <Tab style={{fontSize: "1.3rem"}} label="Collection"/>
            </Tabs>
            <div hidden={selectedTab !== 0}>
                <DraftList />
            </div>
            <div hidden={selectedTab !== 1}>
                <PublishedWorksList/>
            </div>
            <div hidden={selectedTab !== 2}>
                <SavedWorksList/>
            </div>
        </Container>
    )
}

export default Dashboard;
