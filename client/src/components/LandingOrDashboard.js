import React from 'react';
import { useSelector } from 'react-redux';

import Landing from './Landing';
import Dashboard from './Dashboard';
import Loading from './Loading';


const LandingOrDashboard = () => {
    const loggedOut = useSelector(state => !state.authentication.id)
    const loggingIn = useSelector(state => state.authentication.loading)
    const Component = (loggedOut) ? Landing : Dashboard;

    if (loggingIn) {
        return <Loading />
    }
    return (
        <Component />
    )
}
export default LandingOrDashboard;
