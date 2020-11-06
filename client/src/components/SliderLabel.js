import React from 'react';
import Tooltip from '@material-ui/core/Tooltip'

const ValueLabelComponent = ({ children, open, value }) => (
    <Tooltip style={{ whiteSpace: 'pre-line' }} open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
    </Tooltip>
);


export default ValueLabelComponent;
