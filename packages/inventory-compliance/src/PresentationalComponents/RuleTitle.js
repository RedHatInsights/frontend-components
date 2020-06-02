import React from 'react';
import propTypes from 'prop-types';
import {
    Text,
    TextVariants,
    TextContent
} from '@patternfly/react-core';

const RuleTitle = ({ title, identifier }) => (
    <TextContent>
        { title }
        { identifier && <Text component={ TextVariants.small }>{ identifier.label }</Text> || '' }
    </TextContent>
);

RuleTitle.propTypes = {
    title: propTypes.string,
    identifier: propTypes.object
};

export default RuleTitle;
