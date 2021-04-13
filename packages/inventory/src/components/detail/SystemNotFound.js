import React from 'react';
import PropTypes from 'prop-types';
import {
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    Title,
    Button
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/js/icons/cubes-icon';
import { redirectToInventoryList } from './helpers';

/**
 * Empty state when system was not found in inventory.
 * @param {*} params - inventoryId and onBackToListClick.
 */
const SystemNotFound = ({ inventoryId, onBackToListClick }) => {
    return <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={CubesIcon} />
        <Title headingLevel="h5" size="lg">
                System not found
        </Title>
        <EmptyStateBody>
                System with ID {inventoryId} does not exist
        </EmptyStateBody>
        <Button
            variant="primary"
            onClick={() => redirectToInventoryList(inventoryId, onBackToListClick)}
        >
                Back to previous page
        </Button>
    </EmptyState>;
};

SystemNotFound.propTypes = {
    inventoryId: PropTypes.string,
    onBackToListClick: PropTypes.func
};

export default SystemNotFound;
