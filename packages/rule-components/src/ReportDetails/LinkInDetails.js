import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const LinkInDetails = ({ children, href }) => (
    <a href={ href }>
        { children }
        <ExternalLinkAltIcon className="ins-c-rule__report-detail-link"/>
    </a>
);

LinkInDetails.propTypes = {
    children: PropTypes.node,
    href: PropTypes.string
};

export default LinkInDetails;
