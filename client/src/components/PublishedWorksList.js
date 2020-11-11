import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getOwnWorks } from '../store/works'


const PublishedWorksList = () => {
    const dispatch = useDispatch();
    useEffect(()=> {
        dispatch(getOwnWorks());
    }, [])

    return (
        <div>Published</div>
    )
}

export default PublishedWorksList;
