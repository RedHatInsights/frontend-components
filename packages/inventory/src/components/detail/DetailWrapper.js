import React from 'react';
import {
    Drawer,
    DrawerPanelContent,
    DrawerContent,
    DrawerContentBody,
    DrawerHead,
    DrawerActions,
    DrawerCloseButton
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDrawer } from '../../redux/actions';
import { BasicInfo } from '../drawer';
import { Stack, StackItem } from '@patternfly/react-core';

const DetailWrapper = ({ children, hideInvLink, showTags, drawerChildren, className, ...props }) => {
    const dispatch = useDispatch();
    const isExpanded = useSelector(({ entityDetails: { isToggleOpened } }) => isToggleOpened);
    return <Drawer
        className={`ins-c-inventory__drawer ${className || ''}`}
        isExpanded={isExpanded}
        onExpand={() => dispatch(toggleDrawer(true))}
        {...props}
    >
        <DrawerContent
            panelContent={
                <DrawerPanelContent>
                    <DrawerHead>
                        <Stack className="ins-c-inventory__drawer--content">
                            <StackItem>
                                <BasicInfo hideInvLink={ hideInvLink } showTags={ showTags } />
                            </StackItem>
                            <StackItem isFilled>
                                {drawerChildren}
                            </StackItem>
                        </Stack>
                        <DrawerActions>
                            <DrawerCloseButton onClick={() =>  dispatch(toggleDrawer(false))} />
                        </DrawerActions>
                    </DrawerHead>
                </DrawerPanelContent>
            }
        >
            <DrawerContentBody>
                {children}
            </DrawerContentBody>
        </DrawerContent>
    </Drawer>;
};

DetailWrapper.propTypes = {
    children: PropTypes.any,
    hideInvLink: PropTypes.bool,
    showTags: PropTypes.bool
};

export default DetailWrapper;
