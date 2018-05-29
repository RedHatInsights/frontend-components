import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import '@patternfly/patternfly-next/patternfly.css';
import './stories.scss';

import Button from '../src/PresentationalComponents/Button/button';

storiesOf('Button', module)
  .add('with text', () => (
    <React.Fragment>
        <Button type='primary'> PF-Next Primary Button </Button>
        <Button type='secondary'> PF-Next Secondary Button </Button>
        <Button type='tertiary'> PF-Next Tertiary Button </Button>
        <Button type='danger'> PF-Next Danger Button </Button>
    </React.Fragment>
  ));