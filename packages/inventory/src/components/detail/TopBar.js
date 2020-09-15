import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { DeleteModal, TagsModal, TagWithDialog } from '../../shared';
import { Split, SplitItem } from '@patternfly/react-core/dist/js/layouts/Split';
import { Title } from '@patternfly/react-core/dist/js/components/Title';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import { Flex, FlexItem } from '@patternfly/react-core/dist/js/layouts/Flex';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/cjs/Skeleton';
import {
    Dropdown,
    DropdownItem,
    DropdownPosition,
    KebabToggle
} from '@patternfly/react-core/dist/js/components/Dropdown';
import { redirectToInventoryList } from './helpers';
import { useDispatch } from 'react-redux';
import { toggleDrawer } from '../../redux/actions';

/**
 * Top inventory bar with title, buttons (namely remove from inventory and inventory detail button) and actions.
 * Remove from inventory button requires remove modal, which is included at bottom of this component.
 * @param {*} props namely entity and if entity is loaded.
 */
const TopBar = ({
    entity,
    loaded,
    actions,
    deleteEntity,
    addNotification,
    hideInvLink,
    onBackToListClick,
    showDelete,
    showInventoryDrawer,
    showTags
}) => {
    const dispatch = useDispatch();
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const inventoryActions = [ ... actions || [] ];
    return (
        <Split className="ins-c-inventory__detail--header">
            <SplitItem isFilled>
                {
                    loaded ? (
                        <Flex>
                            <FlexItem>
                                <Title headingLevel="h1" size='2xl'>{ entity && entity.display_name }</Title>
                            </FlexItem>
                            {
                                showTags &&
                                <FlexItem>
                                    <TagWithDialog count={ entity && entity.tags && entity.tags.length } systemId={ entity && entity.id } />
                                    <TagsModal />
                                </FlexItem>
                            }
                        </Flex>
                    ) :
                        <Skeleton size={ SkeletonSize.md } />
                }
            </SplitItem>
            {
                <SplitItem>
                    {
                        loaded ?
                            <Flex>
                                {showDelete && <FlexItem>
                                    <Button
                                        onClick={ () => setIsModalOpen(true) }
                                        variant="secondary">
                                        Delete
                                    </Button>
                                </FlexItem>}
                                {hideInvLink || (
                                    <FlexItem>
                                        <a className='ins-c-entity-detail__inv-link' href={`./insights/inventory/${entity.id}`}>View in Inventory</a>
                                    </FlexItem>
                                )}
                                { inventoryActions && inventoryActions.length > 0 && (
                                    <FlexItem>
                                        <Dropdown
                                            onSelect={ () => setIsOpen(false) }
                                            toggle={ <KebabToggle
                                                onToggle={(isOpen) => setIsOpen(isOpen)}
                                            />}
                                            isOpen={ isOpen }
                                            isPlain
                                            position={ DropdownPosition.right }
                                            dropdownItems={ [ ...(inventoryActions ?
                                                inventoryActions.map((action, key) => (
                                                    <DropdownItem
                                                        key={ action.key || key }
                                                        component="button"
                                                        onClick={ (event) => action.onClick(event, action, action.key || key) }
                                                    >
                                                        { action.title }
                                                    </DropdownItem>)
                                                ) : []) ] }
                                        />
                                    </FlexItem>)}
                                <FlexItem>
                                    {
                                        showInventoryDrawer &&
                                        <Button onClick={() => dispatch(toggleDrawer(true))}>
                                            Show more information
                                        </Button>
                                    }
                                </FlexItem>
                            </Flex>
                            :
                            <Skeleton size={ SkeletonSize.lg } />
                    }
                </SplitItem>
            }
            { isModalOpen && (
                <DeleteModal
                    handleModalToggle={() => setIsModalOpen(!isModalOpen)}
                    isModalOpen={isModalOpen}
                    currentSytems={entity}
                    onConfirm={() => {
                        addNotification({
                            id: 'remove-initiated',
                            variant: 'warning',
                            title: 'Delete operation initiated',
                            description: `Removal of ${entity.display_name} started.`,
                            dismissable: false
                        });
                        deleteEntity(
                            [ entity.id ],
                            entity.display_name,
                            () => redirectToInventoryList(entity.id, onBackToListClick)
                        );
                        setIsModalOpen(false);
                    }}
                />)}
        </Split>
    );
};

TopBar.propTypes = {
    entity: PropTypes.object,
    loaded: PropTypes.bool,
    showDelete: PropTypes.bool,
    hideInvLink: PropTypes.bool,
    showInventoryDrawer: PropTypes.bool,
    showTags: PropTypes.bool,
    actions: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        title: PropTypes.node,
        onClick: PropTypes.func
    })),
    deleteEntity: PropTypes.func,
    addNotification: PropTypes.func,
    onBackToListClick: PropTypes.func
};

TopBar.defaultProps = {
    actions: [],
    loaded: false,
    hideInvLink: false,
    showDelete: false,
    showInventoryDrawer: false,
    deleteEntity: () => undefined,
    addNotification: () => undefined,
    onBackToListClick: () => undefined
};

export default TopBar;
