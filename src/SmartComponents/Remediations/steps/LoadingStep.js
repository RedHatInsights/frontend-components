import React, { Component } from 'react';

import { SyncAltIcon } from '@patternfly/react-icons';

import './LoadingStep.scss';

export default function LoadingStep (props) {
    return (
        <p className="ins-c-remediations-loading-step">
            <SyncAltIcon/>
        </p>
    );
}

