import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Stack,
    StackItem,
    CardBody,
    TextContent,
    Text,
    TextList,
    TextVariants,
    TextListItemVariants,
    TextListVariants,
    TextListItem
} from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '../../../../PresentationalComponents/Skeleton';

const Clickable = ({ item: { onClick, value, target }}) => (
    <Fragment>
        {
            value !== 0 ?
                <a onClick={ event => {
                    event.preventDefault();
                    onClick(event, { value, target });
                } } href={ `${window.location.href}/${target}` }>{ value }</a> :
                'None'
        }
    </Fragment>
);

Clickable.propTypes = {
    item: PropTypes.shape({
        value: PropTypes.string,
        target: PropTypes.string,
        onClick: PropTypes.func
    })
};

Clickable.defaultProps = {
    item: {}
};

const LoadingCard = ({ title, isLoading, items }) => {
    return (
        <Stack gutter="md">
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
                                            item.value
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
        size: PropTypes.oneOf(Object.values(SkeletonSize))
    }))
};

LoadingCard.defaultProps = {
    isLoading: true,
    items: []
};

export default LoadingCard;
