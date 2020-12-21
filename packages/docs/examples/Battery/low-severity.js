import React from 'react';
import { createUseStyles } from 'react-jss';
import { Battery } from '@redhat-cloud-services/frontend-components';
import '@redhat-cloud-services/frontend-components/components/Battery.css';

const useStyle = createUseStyles({
    container: {
        margin: 'auto',
        display: 'flex'
    }
});

const NormalExample = () => {
    const classes = useStyle();
    return (
        <div className={classes.container}>
            <Battery label="With prop: 1" severity={1} />
            <Battery label="With prop: low" severity="low" />
            <Battery label="With prop: info" severity="info" />
        </div>
    );
};

export default NormalExample;
