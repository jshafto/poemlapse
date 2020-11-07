import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom'

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import { newDraft, fetchingDraft, getDrafts } from '../store/drafts'

const Dashboard = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const fetchingDraftId = useSelector(state=>state.entities.drafts.fetching)
    const drafts = useSelector(state=>Object.values(state.entities.drafts.byId));

    useEffect(()=> {
        if (fetchingDraftId) {
            history.push(`/drafts/${fetchingDraftId}`)
        }
    }, [fetchingDraftId])

    useEffect(() => {
        dispatch(getDrafts())
    },[])


    const createPoem = () => {
        dispatch(newDraft('untitled'))
    }



    return (
        <Container>
            <Typography variant="h4">Drafts</Typography>
            <Button onClick={createPoem}>Create new poem</Button>
            {drafts.map(draft=>(
                <div key={draft.id}>
                <NavLink to={`/drafts/${draft.id}`} >
                    {draft.title}
                </NavLink>
                </div>
            ))}
        </Container>
    )
}

export default Dashboard;
