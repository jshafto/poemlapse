import React from 'react';
import { useHistory } from 'react-router-dom';

const PublishedProfileWorks = ({ works }) => {
    const history = useHistory();

    const viewWork = (id) => () => {
        history.push(`/works/${id}`)
    }

    return (
        <div/>
    );
}

export default PublishedProfileWorks;
