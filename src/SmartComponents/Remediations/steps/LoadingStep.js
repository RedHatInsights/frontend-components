import React, { PureComponent } from 'react';
import propTypes from 'prop-types';

import { Skeleton, SkeletonSize } from '../../../PresentationalComponents/Skeleton';
import { Stack, StackItem } from '@patternfly/react-core';

import './LoadingStep.scss';

export default class LoadingStep extends PureComponent {

    componentDidMount() {
        this.props.onValidChange(false);
    }

    componentWillUnmount () {
        this.props.onValidChange(true);
    }

    render () {
        return (
            <Stack gutter='sm' className='ins-c-remediations-loading-step'>
                <StackItem><h1><Skeleton size={ SkeletonSize.sm } /></h1></StackItem>
                <StackItem>
                    <Skeleton size={ SkeletonSize.lg } className='ins-c-remediations-loading-step-main' />
                </StackItem>
                <StackItem>
                    <Stack gutter='sm'>
                        <StackItem>
                            <Skeleton size={ SkeletonSize.sm } />
                        </StackItem>
                        <StackItem>
                            <Skeleton size={ SkeletonSize.xs } />
                        </StackItem>
                    </Stack>
                </StackItem>
            </Stack>
        );
    }
}

LoadingStep.propTypes = {
    onValidChange: propTypes.func.isRequired
};

