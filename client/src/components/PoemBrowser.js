import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container'

import PoemContainer from './PoemContainer';
import { getWorks, clearWorks } from '../store/works'

const PoemBrowser = () => {
    const dispatch = useDispatch();
    const works = useSelector(state => Object.values(state.entities.works.byId));

    useEffect(() => {
        dispatch(getWorks());
        return () => dispatch(clearWorks())
    }, [])

    return (
        <Container maxWidth='sm' style={{marginTop:30}}>
        <Grid direction='column' alignItems='center' container>
            {works.map(work => (
                <Grid key={work.id} item xs={12} style={{width:'100%', marginBottom:30}}>
                    <PoemContainer work={work} />
                </Grid>

            ))}
        </Grid>
        </Container>
    )
}

export default PoemBrowser;
