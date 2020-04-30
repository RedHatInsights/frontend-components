import React from 'react';

const ConditionalLink = ({ children, href, ...additionalProps }) => (
    href && <a href={ href } { ...additionalProps }>{ children }</a> || children || ''
);

export default ConditionalLink;
