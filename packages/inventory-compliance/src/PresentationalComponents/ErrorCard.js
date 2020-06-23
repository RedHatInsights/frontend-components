import React from 'react';
import propTypes from 'prop-types';
import {
    Card,
    CardHeader,
    CardBody
} from '@patternfly/react-core';
import { NotEqualIcon } from '@patternfly/react-icons';

const ErrorCard = ({ errorMsg }) => (
    <Card className="ins-error-card">
        <CardHeader>
            <NotEqualIcon />
        </CardHeader>
        <CardBody>
            <div>{ errorMsg }</div>
        </CardBody>
    </Card>
);

ErrorCard.propTypes = {
    errorMsg: propTypes.string
};

export default ErrorCard;
