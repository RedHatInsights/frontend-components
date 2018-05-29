import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import '@patternfly/patternfly-next/patternfly.css';
import './stories.scss';

import Preview from './StoryComponents/Preview/preview';

import Button from '../src/PresentationalComponents/Button/button';

storiesOf('Components', module)
  .add('Button', () => (
    <React.Fragment>
        <Preview type='Example'>
            <Button type='primary'> PF-Next Primary Button </Button>
            <Button type='secondary'> PF-Next Secondary Button </Button>
            <Button type='tertiary'> PF-Next Tertiary Button </Button>
            <Button type='danger'> PF-Next Danger Button </Button>
        </Preview>
        <Preview type='HTML'>
            <pre> {`
                <Button type='primary'> PF-Next Primary Button </Button>,
                <Button type='secondary'> PF-Next Secondary Button </Button>,
                <Button type='tertiary'> PF-Next Tertiary Button </Button>,
                <Button type='danger'> PF-Next Danger Button </Button>
            `}</pre>
        </Preview>
    </React.Fragment>
  ));