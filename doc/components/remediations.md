# Remediation Wizard

Remediation Wizard is a component that provides UI integration between the Remediation application and other MCOM applications. It allows MCOM applications to create/modify remediations from the respective application.

The component enables user flows like this:
1. The user starts their work in one of the MCOM applications (e.g. Vulnerabilities).
1. The user makes a certain selection of issues/systems to remediate.
    For example, they navigate into details of a particular CVE and use checkboxes in the data table to select some of the affected systems.
1. After that, they click a **Remediate with Ansible** button
1. Still in the Vulnerabilities application, a wizard opens in a modal window that guides the user through turning the issue/system selection into a remediation
1. Once the user completes the wizard a new remediation is created in the Remediations application (or an existing one is altered).
    The user either stays within the Vulnerabilities application the whole time or may be redirected to the Remediations application upon creation

The component is hot-loaded using Javacript API provided by [insights-chrome](https://github.com/redhatinsights/insights-chrome).
The API is currently considered experimental thus the `experimental` namespace.

Here's an example of a component that invokes the Javascript API to hot-load Remediations support and stores the result in the component state:
```JSX
import React from 'react';
import * as ReactCore from '@patternfly/react-core';

    constructor(props) {
        super(props);

        // ...

        insights.experimental.loadRemediations({
            react: React, // <-- React and PF-react-core dependencies passed in so that the loaded component can link
            reactCore: ReactCore
        }).then(remediations => this.setState({ remediations }));
```

Next, the `RemediationWizard` component needs to be placed into the virtual DOM.
The component should be rendered always.
The actual modal will not be shown to the user until initiated programatically.
```JSX
    render() {
        return (
            // ...
            { this.state.remediations && <this.state.remediations.RemediationWizard /> }
            // ...
```

Next, a wizard hand-off handler needs to be implemented.
This function sumarizes the choices made by the user so far (What CVE are they looking at? What systems did they check?) and passes that into Remediations.
Afterwards, the Remediation wizard modal is opened where additional information is gathered.
Once the user completes the wizard the information passed in is combined with information obtained by the wizard and a new remediation is created.

The call to `openWizard()` opens the wizard modal.
The function returns a promise that completes once the wizard is:
* canceled (resolves with false)
* completed (resolves with result object)

Details of the remediation can be accessed in `result.remediation`.
Optionally, if the application uses [Notifications component](https://github.com/RedHatInsights/insights-frontend-components/blob/master/doc/components/notifications.md) a notification informing of successful remediation creation is provided under `result.getNotification()`

```JSX
    onRemediationButton () {
        const issue = `vulnerabilities:${this.state.cveName}`; // TODO: modify as needed based on user selection
        const systems = ['34b9f7d9-fc81-4e0f-bef0-c4b402a1510e']; // modify as needed (e.g. based on user selection of system checkboxes in data table)

        const promise = this.state.remediations.openWizard({
            issues: [{
                id: issue
            }],
            systems
        })

        // optionally, a notification can be created once remediation creation is finished
        promise.then(result => {
            result && dispatchAction(addNotification(result.getNotification()));
        });
    }
```

Finally, a **Remediate with Ansible** button is added with `onRemediationButton` as its onClick handler:
```JSX
    <ReactCore.Button variant='primary' onClick={ this.onRemediationButton }>Remediate with Ansible</ReactCore.Button>
```
