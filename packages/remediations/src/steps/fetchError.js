import React from 'react';
import propTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';
import {
    Title,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import red from '@patternfly/react-tokens/dist/js/global_palette_red_100';

const FetchError = (props) => {

    const { resolutionsCount } = props;

    const { input } = useFieldApi(props);
    input.valid = false;

    return (
        <EmptyState variant={ EmptyStateVariant.small }>
            <EmptyStateIcon color={ red.value } icon={ ExclamationCircleIcon } />
            <Title headingLevel="h4" size="lg">
                Unexpected error
            </Title>
            <EmptyStateBody>
                Please try again later. {resolutionsCount !== 0 && <div>
                    Hint: No resolutions for selected issues.
                </div>}
            </EmptyStateBody>
        </EmptyState>
    );
};

FetchError.propTypes = {
    resolutionsCount: propTypes.number
};

export default FetchError;
