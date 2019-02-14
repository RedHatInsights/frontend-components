import React, { Component } from 'react';

import { Skeleton, SkeletonSize } from '../../../PresentationalComponents/Skeleton';
import { Stack, StackItem } from '@patternfly/react-core';

import './LoadingStep.scss';

export default function LoadingStep (props) {
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

