import React from 'react';
import PropTypes from 'prop-types';
import {
    EmptyState,
    EmptyStateVariant,
    EmptyStateBody,
    EmptyStateSecondaryActions,
    Button,
    Bullseye,
    Spinner,
    Progress
} from '@patternfly/react-core';

const LoadingStep = ({ onClose, customText, progressStep, progressTexts }) => <Bullseye>
    <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__empty-state">
        <Spinner />
        <EmptyStateBody>
            {progressTexts ?
                <Progress
                    value={progressStep}
                    min={0}
                    max={progressTexts.length - 1}
                    title=" "
                    label={progressTexts[progressStep]}
                    valueText={progressTexts[progressStep]}
                />
                : customText
            }
        </EmptyStateBody>
        { onClose &&
        <EmptyStateSecondaryActions>
            <Button variant="link" onClick={ onClose }>Cancel</Button>
        </EmptyStateSecondaryActions> }
    </EmptyState>
</Bullseye>;

LoadingStep.propTypes = {
    onClose: PropTypes.func,
    customText: PropTypes.string,
    progressStep: PropTypes.number.isRequired,
    progressTexts: PropTypes.arrayOf(PropTypes.string).isRequired
};

LoadingStep.defaultProps = {
    customText: 'Loading, please wait.'
};

export default LoadingStep;
