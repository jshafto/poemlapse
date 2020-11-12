import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { compareAsc, compareDesc, format } from 'date-fns';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableBody from '@material-ui/core/TableBody';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


import { deleteDraft, getDrafts } from '../store/drafts'

const DraftList = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const fetchingDraftId = useSelector(state => state.entities.drafts.fetching)
    const drafts = useSelector(state => Object.values(state.entities.drafts.byId).filter(draft=> !draft.published));
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingPoem, setDeletingPoem] = useState(null);

    useEffect(() => {
        if (fetchingDraftId) {
            history.push(`/drafts/${fetchingDraftId}`)
        }
    }, [fetchingDraftId])

    useEffect(() => {
        dispatch(getDrafts())
    }, [])

    const handleSortByColumn = (col) => (e) => {
        setOrder((orderBy === col && order === 'asc') ? 'desc' : 'asc')
        setOrderBy(col);
    };
    const goToDraft = (id) => () => {
        history.push(`/drafts/${id}`);
    };

    const handleDelete = (id) => () => {
        dispatch(deleteDraft(id));
        setDeleteOpen(false);
        setDeletingPoem(null);
    }
    const handleDraftDeleteOpen = (id, title) => (e) => {
        e.stopPropagation();
        // dispatch(deleteDraft(id));
        setDeleteOpen(true);
        setDeletingPoem({id, title});
    }

    const handleCloseDelete = () => {
        setDeletingPoem(null);
        setDeleteOpen(false);
    }

    const compareDraftList = (order, col) => (a, b) => {

        if (order === 'asc') {
            if (col === 'title') {
                return a[col].localeCompare(b[col])
            } else {
                return compareAsc(new Date(a[col]), new Date(b[col]))
            }
        } else {
            if (col === 'title') {
                return b[col].localeCompare(a[col])
            } else {
                return compareDesc(new Date(a[col]), new Date(b[col]))
            }
        }
    }


    return (
        <Table size="small" >
            <TableHead>
                {(deletingPoem) ? (
                <Dialog open={deleteOpen} onClose={handleCloseDelete}>
                    <DialogTitle>{`Are you sure you would like to delete "${deletingPoem.title}"?`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`If you proceed, draft of "${deletingPoem.title}" and all edit history will be permanently deleted. This action cannot be undone.`}
                        </DialogContentText>
                        <DialogActions>
                            <Button
                                elevation={0}
                                onClick={handleCloseDelete}
                                variant="outlined"
                                >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete(deletingPoem.id)}
                                variant='contained'
                                color='primary'
                                >
                                Delete draft
                            </Button>

                        </DialogActions>
                    </DialogContent>
                </Dialog>
                ) : (null)}
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
                        style={{ borderRadius: 32, cursor: 'pointer' }}
                    >
                        <TableCell style={{ borderBottom: 0 }}>{draft.title}</TableCell>
                        <TableCell style={{ borderBottom: 0 }}>{format(new Date(draft.date_created), 'MMM d, yyyy')}</TableCell>
                        <TableCell style={{ borderBottom: 0 }}>{format(new Date(draft.date_updated), 'MMM d, yyyy')}</TableCell>
                        <TableCell padding="none" style={{ borderBottom: 0 }}>
                            <Tooltip title="Delete draft">
                                <IconButton
                                    size="small"
                                    onClick={handleDraftDeleteOpen(draft.id, draft.title)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default DraftList;
