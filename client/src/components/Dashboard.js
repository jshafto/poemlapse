import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { compareAsc, compareDesc, format } from 'date-fns';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableBody from '@material-ui/core/TableBody';
import DeleteIcon from '@material-ui/icons/Delete'


import { newDraft, deleteDraft, getDrafts } from '../store/drafts'

const Dashboard = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const fetchingDraftId = useSelector(state => state.entities.drafts.fetching)
    const drafts = useSelector(state => Object.values(state.entities.drafts.byId));
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');

    useEffect(() => {
        if (fetchingDraftId) {
            history.push(`/drafts/${fetchingDraftId}`)
        }
    }, [fetchingDraftId])

    useEffect(() => {
        dispatch(getDrafts())
    }, [])


    const createPoem = () => {
        dispatch(newDraft('untitled'))
    }

    const handleSortByColumn = (col) => (e) => {
        setOrder((orderBy === col && order === 'asc') ? 'desc' : 'asc')
        setOrderBy(col);
    };
    const goToDraft = (id) => () => {
        history.push(`/drafts/${id}`);
    };

    const handleDraftDelete = (id) => (e) => {
        e.stopPropagation();
        dispatch(deleteDraft(id));
    }

    const compareDraftList = (order, col) => (a,b) => {

        if (order==='asc') {
            if (col==='title') {
                return a[col].localeCompare(b[col])
            } else {
                return compareAsc(new Date(a[col]), new Date(b[col]))
            }
        } else {
            if (col==='title') {
                return b[col].localeCompare(a[col])
            } else {
                return compareDesc(new Date(a[col]), new Date(b[col]))
            }
        }
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4">Drafts</Typography>
            <Tooltip title="New Draft">
                <IconButton color="primary" variant="outlined" onClick={createPoem}>
                    <AddCircleOutlineIcon />
                </IconButton>
            </Tooltip>
            <Table size="small" >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'title'}
                                direction={orderBy === 'title' ? order : 'asc'}
                                onClick={handleSortByColumn('title')}
                            >
                                Title
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'date_created'}
                                direction={orderBy === 'date_created' ? order : 'asc'}
                                onClick={handleSortByColumn('date_created')}
                            >
                                Date Created
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'date_updated'}
                                direction={orderBy === 'date_updated' ? order : 'asc'}
                                onClick={handleSortByColumn('date_updated')}
                            >
                                Last Modified
                            </TableSortLabel>
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {drafts.sort(compareDraftList(order, orderBy)).map(draft => (
                        <TableRow
                            key={draft.id}
                            hover
                            onClick={goToDraft(draft.id)}
                            style={{borderRadius: 32}}
                            style={{cursor:'pointer'}}
                        >
                            <TableCell style={{borderBottom: 0}}>{draft.title}</TableCell>
                            <TableCell style={{borderBottom: 0}}>{format(new Date(draft.date_created), 'MMM d, yyyy')}</TableCell>
                            <TableCell style={{borderBottom: 0}}>{format(new Date(draft.date_updated), 'MMM d, yyyy')}</TableCell>
                            {/* <TableCell style={{borderBottom: 0}}>{draft.date_created}</TableCell>
                            <TableCell style={{borderBottom: 0}}>{draft.date_updated}</TableCell> */}
                            <TableCell padding="none" style={{borderBottom: 0}}>
                                <Tooltip title="Delete draft">
                                <IconButton
                                    size="small"
                                    onClick={handleDraftDelete(draft.id)}>
                                    <DeleteIcon />
                                </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    )
}

export default Dashboard;
