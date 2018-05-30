import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import '@patternfly/patternfly-next/patternfly.css';
import './stories.scss';

import Button from '../src/PresentationalComponents/Button/button';
import Preview from './Components/Preview/preview';
import Example from './Components/Example/example';


storiesOf('Components', module)
    .add('Buttons', () => (
        <Example name='Buttons'>
            <Preview type='Preview'>
                <Button type='primary'> PF-Next Primary Button </Button>
                <Button type='secondary'> PF-Next Secondary Button </Button>
                <Button type='tertiary'> PF-Next Tertiary Button </Button>
                <Button type='danger'> PF-Next Danger Button </Button>
            </Preview>
        </Example>
    ));