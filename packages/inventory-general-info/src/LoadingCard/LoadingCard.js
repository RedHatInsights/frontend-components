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

const valueToText = (value, singular, plural) => {
    if ((value || value === 0) && singular) {
        return value === 1 ? `1 ${singular}` : `${value} ${plural || `${singular}s`}`;
    }

    if (value === 0) {
        return 'None';
    }

    return value || 'Not available';
};

export const Clickable = ({ item: { onClick, value, target, plural, singular } }) => (
    <a
        onClick={ event => {
            event.preventDefault();
            onClick(event, { value, target });
        } }
        href={ `${window.location.href}/${target}` }
    >
        { valueToText(value, singular, plural) }
    </a>
);

Clickable.propTypes = {
    item: PropTypes.shape({
        value: PropTypes.node,
        target: PropTypes.string,
        onClick: PropTypes.func,
        plural: PropTypes.string,
        singular: PropTypes.string
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
                                        item.onClick && item.value ?
                                            <Clickable item={ item }/> :
                                            valueToText(item.value, item.singular, item.plural)
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
        plural: PropTypes.string,
        singular: PropTypes.string
    }))
};

LoadingCard.defaultProps = {
    isLoading: true,
    items: []
};

export default LoadingCard;
