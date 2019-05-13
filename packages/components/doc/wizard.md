# Wizard

Implementation of wizard component, which is a collection of modals with steps.

## Usage

Import Wizard from this package.

```JSX
import React from 'react';

// Import Components
import { Button } from '@patternfly/react-core';
import { Wizard } from '@redhat-insights/insights-frontent-components/';

// Import your steps for the wizard
// These are just components that will render in the modal body section
import Step1 from './Step1';
import Foo from './Foo';
import Bar from './Bar';

class YourCmp extends React.Component {

    // Set the default state of the modal
    constructor () {
        super();
        this.state = {
            isModalOpen: false
        };
        this.onClose = this.onClose.bind(this);
        this.openWizard = this.openWizard.bind(this);
    };

    // Handle the open/close
    onClose(submitted) {
        this.setState({
            isModalOpen: false
        });

        if (submitted) {
            // on-submit action goes here...
        }
    };

    openWizard() {
        this.setState({
            isModalOpen: true
        });
    }

    render() {

        const { isModalOpen } = this.state;

        // Wizard Content
        const ModalStepContent = [
            <Step1 key='step1'/>,
            <Foo key='Foo'/>
            <Bar key='Bar'/>
        ];

        return (
            <React.Fragment>
                // Button to open the wizard
                <Button variant='primary' onClick={ this.openWizard }> Open Wizard </Button>
                // The confirmAction prop is optional. If not defined, the button on the last step will say "Confirm".
                <Wizard
                    isLarge
                    title="Create Plan"
                    className='ins-c-plan-modal'
                    confirmAction="Save"
                    onClose = { this.onClose }
                    isOpen= { isModalOpen }
                    content = { ModalStepContent }
                />
            </React.Fragment>
        );
    }
}
```

## Props

Wizard

```javascript
{
    isLarge: PropTypes.bool,
    title: PropTypes.string,
    className: PropTypes.string,
    confirmAction: PropTypes.string,
    isOpen: PropTypes.any,
    onClose: PropTypes.func,
    content: PropTypes.array
};
```
