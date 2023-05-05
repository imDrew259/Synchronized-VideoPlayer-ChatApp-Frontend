import { CircularProgress } from '@mui/material';
import React from 'react';

const Loader = ({ margin }) => {
    return (
        <div style={{ marginTop: '20em'}}>
            <CircularProgress />
        </div>
    )
};

export default Loader;
