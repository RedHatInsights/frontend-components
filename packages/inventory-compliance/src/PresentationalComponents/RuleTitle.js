import React from 'react';
import propTypes from 'prop-types';
import {
    Stack,
    StackItem,
    Text,
    TextVariants,
    TextContent
} from '@patternfly/react-core';

const RuleTitle = ({ title, identifier }) => (
    <Stack>
        <StackItem>{ title }</StackItem>
        { identifier &&
            <StackItem>
                <TextContent>
                    <Text component={ TextVariants.small }>{ identifier.label }</Text>
                </TextContent>
            </StackItem> || '' }
    </Stack>
);

RuleTitle.propTypes = {
    title: propTypes.string,
    identifier: propTypes.object
};

export default RuleTitle;
