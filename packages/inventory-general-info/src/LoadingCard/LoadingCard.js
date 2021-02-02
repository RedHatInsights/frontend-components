import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Stack,
    StackItem,
    TextContent,
    Text,
    TextList,
    TextVariants,
    TextListItemVariants,
    TextListVariants,
    TextListItem
} from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';

export const Clickable = ({ item: { onClick, value, target, plural } }) => (
    (value && value !== 0) ?
        <a onClick={ event => {
            event.preventDefault();
            onClick(event, { value, target });
        } } href={ `${window.location.href}/${target}` }>{ `${value}${plural ? ` ${plural}` : ''}` }</a> :
        value === 0 ?  plural ? `0 ${plural}` : 'None' : 'Not available'
);

Clickable.propTypes = {
    item: PropTypes.shape({
        value: PropTypes.node,
        target: PropTypes.string,
        onClick: PropTypes.func,
        plural: PropTypes.node
    })
};

Clickable.defaultProps = {
    item: {}
};

const LoadingCard = ({ title, isLoading, items }) => {
    return (
        <Stack hasGutter>
            <StackItem>
                <TextContent>
                    <Text component={ TextVariants.h1 }>
                        { title }
                    </Text>
                </TextContent>
            </StackItem>
            <StackItem isFilled>
                <TextContent>
                    <TextList component={ TextListVariants.dl }>
                        { items.map((item, key) => (
                            <Fragment key={ key }>
                                <TextListItem component={ TextListItemVariants.dt }>
                                    { item.title }
                                </TextListItem>
                                <TextListItem component={ TextListItemVariants.dd }>
                                    { isLoading && <Skeleton size={ item.size || SkeletonSize.sm } /> }
                                    { !isLoading && (
                                        item.onClick ?
                                            <Clickable item={ item }/> :
                                            (item.value || (item.value === 0 ? item.plural ? `0 ${item.plural}` : 'None' : 'Not available'))
                                    ) }
                                </TextListItem>
                            </Fragment>
                        )) }
                    </TextList>
                </TextContent>
            </StackItem>
        </Stack>
    );
};

LoadingCard.propTypes = {
    title: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        value: PropTypes.node,
        onClick: PropTypes.func,
        size: PropTypes.oneOf(Object.values(SkeletonSize)),
        plural: PropTypes.node
    }))
};

LoadingCard.defaultProps = {
    isLoading: true,
    items: []
};

export default LoadingCard;
