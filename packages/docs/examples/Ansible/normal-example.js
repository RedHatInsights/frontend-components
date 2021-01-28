import React from 'react';
import { createUseStyles } from 'react-jss';
import { Ansible } from '@redhat-cloud-services/frontend-components';

const useStyle = createUseStyles({
    container: {
        maxWidth: 48,
        margin: 'auto'
    }
});

const NormalExample = () => {
    const classes = useStyle();
    return (
        <div className={classes.container}>
            <Ansible />
        </div>
    );
};

export default NormalExample;
