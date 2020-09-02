import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal/Modal';
import { Split } from '@patternfly/react-core/dist/js/layouts/Split/Split';
import { SplitItem } from '@patternfly/react-core/dist/js/layouts/Split/SplitItem';
import { Stack } from '@patternfly/react-core/dist/js/layouts/Stack/Stack';
import { StackItem } from '@patternfly/react-core/dist/js/layouts/Stack/StackItem';
import { Level } from '@patternfly/react-core/dist/js/layouts/Level/Level';
import { LevelItem } from '@patternfly/react-core/dist/js/layouts/Level/LevelItem';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { ClipboardCopy } from '@patternfly/react-core/dist/js/components/ClipboardCopy/ClipboardCopy';

import ExclamationTriangleIcon from  '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

const DeleteModal = ({ handleModalToggle, isModalOpen, currentSytems, onConfirm }) => {
    let systemToRemove;
    let systemLabel = 'system';
    if (Array.isArray(currentSytems)) {
        systemToRemove = currentSytems.length === 1 ? currentSytems[0].display_name : `${currentSytems.length} systems`;
        systemLabel = currentSytems.length === 1 ? systemLabel : 'systems';
    } else {
        systemToRemove = currentSytems.display_name;
    }

    return <Modal
        variant="small"
        title="Remove from inventory"
        className="ins-c-inventory__table--remove"
        isOpen={isModalOpen}
        onClose={() => handleModalToggle(false)}
    >
        <Split hasGutter>
            <SplitItem><ExclamationTriangleIcon size="xl" className="ins-m-alert" /></SplitItem>
            <SplitItem isFilled>
                <Stack hasGutter>
                    <StackItem>
                        {systemToRemove} will be removed from
                                    all {location.host} applications and services. You need to re-register
                        the {systemLabel} to add it back to your inventory.
                    </StackItem>
                    <StackItem>
                        To disable the daily upload for this {systemLabel}, use the following command:
                    </StackItem>
                    <StackItem>
                        <ClipboardCopy>insights-client --unregister</ClipboardCopy>
                    </StackItem>
                </Stack>
            </SplitItem>
        </Split>
        <Level hasGutter>
            <LevelItem>
                <Button variant="danger" onClick={onConfirm}>
                    Remove
                </Button>
                <Button variant="link" onClick={() => handleModalToggle(false)}>Cancel</Button>
            </LevelItem>
        </Level>
    </Modal>;
};

const ActiveSystemProp = PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string
});

DeleteModal.propTypes = {
    isModalOpen: PropTypes.bool,
    currentSytems: PropTypes.oneOfType([ ActiveSystemProp, PropTypes.arrayOf(ActiveSystemProp) ]),
    handleModalToggle: PropTypes.func,
    onConfirm: PropTypes.func
};

DeleteModal.defaultProps = {
    isModalOpen: false,
    currentSytems: {},
    handleModalToggle: () => undefined,
    onConfirm: () => undefined
};

export default DeleteModal;
