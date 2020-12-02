import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import computeSourcesUrl from '../utilities/computeSourcesUrl';

const EditLink = ({ id }) => {
    const intl = useIntl();
    const message =  intl.formatMessage({ id: 'wizard.editSource', defaultMessage: 'Edit source' });

    if (insights.chrome.getApp() === 'sources') {
        return (<Link to={`/sources/detail/${id}`}>
            <Button variant='primary' className="pf-u-mt-xl">
                { message }
            </Button>
        </Link>);
    }

    return (
        <Button
            variant='primary'
            className="pf-u-mt-xl"
            component='a'
            target="_blank"
            href={`${computeSourcesUrl()}/detail/${id}`}
            rel="noopener noreferrer"
        >
            { message }
        </Button>
    );
};

EditLink.propTypes = {
    id: PropTypes.string.isRequired
};

export default EditLink;
