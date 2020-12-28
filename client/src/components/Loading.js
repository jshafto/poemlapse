import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';

const Loading = () => {
    return (
        <Container style={{display: 'flex', justifyContent: 'center',alignItems: 'center', marginTop: 50}}>
            <CircularProgress color='secondary'/>
        </Container>
    )
}

export default Loading;
