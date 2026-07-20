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

## Hot-loading the Wizard using RemediationButton
The recommended way of integrating Remediation Wizard is via `<RemediationButton/>` component.
Here's what the usage looks like:

```JSX
    <RemediationButton dataProvider={this.dataProvider} />
```

### Data Provider
`dataProvider` is a required parameter.
This function is called when the button is clicked.
This function is expected to sumarizes the choices made by the user so far (What CVE are they looking at? What systems did they check?).
The wizard builds on information provided, combines it with information collected by wizard steps and eventually creates a new remediation.

`dataProvider` may return a Promise.

Here's an example of `dataProvider` implementation:

```JSX
    dataProvider () {
        return {
            issues: [{
                id: 'vulnerabilities:CVE-2019-3815',
                description: 'Bonding will not fail over to the backup link when bonding options are partially read',
                systems: ['34b9f7d9-fc81-4e0f-bef0-c4b402a1510e']
            }, {
                id: 'advisor:network_bond_opts_config_issue|NETWORK_BONDING_OPTS_DOUBLE_QUOTES_ISSUE',
                description: 'CVE-2017-17712',
                systems: ['34b9f7d9-fc81-4e0f-bef0-c4b402a1510e', '9dfe0269-b676-4e15-8bb1-b7003ea00718']
            }]
        };
    }
```

Here, the Remediation wizard will be started for 2 issues (`vulnerabilities:CVE-2019-3815` and `advisor:network_bond_opts_config_issue|NETWORK_BONDING_OPTS_DOUBLE_QUOTES_ISSUE`). A Remediation will be created/appended with these issues for 1 or 2 systems, respectively.

In cases when the set of systems is homogeneous there is no need to repeat it for every issue.
In those cases the system array can be defined on top level.

```JSX
    dataProvider () {
        return {
            issues: [{
                id: 'vulnerabilities:CVE-2019-3815',
                description: 'Bonding will not fail over to the backup link when bonding options are partially read'
            }, {
                id: 'advisor:network_bond_opts_config_issue|NETWORK_BONDING_OPTS_DOUBLE_QUOTES_ISSUE',
                description: 'CVE-2017-17712'
            }],
            systems: ['34b9f7d9-fc81-4e0f-bef0-c4b402a1510e', '9dfe0269-b676-4e15-8bb1-b7003ea00718']
        };
    }
```

In this case each of the two issues will be applied to both systems.

Note that these two approaches can be combined.
The top-level system definition is inherited to every issue definition that does not define the system array itself:

```JSX
    dataProvider () {
        return {
            issues: [{
                id: 'vulnerabilities:CVE-2019-3815',
                description: 'Bonding will not fail over to the backup link when bonding options are partially read'
            }, {
                id: 'vulnerabilities:CVE-2017-17713',
                description: 'Bonding will not fail over to the backup link when bonding options are partially read'
            }, {
                id: 'advisor:network_bond_opts_config_issue|NETWORK_BONDING_OPTS_DOUBLE_QUOTES_ISSUE',
                description: 'CVE-2017-17712',
                systems: ['8f87213d-8c00-49a8-a9f5-8295fa39c7e0']
            }],
            systems: ['34b9f7d9-fc81-4e0f-bef0-c4b402a1510e', '9dfe0269-b676-4e15-8bb1-b7003ea00718']
        };
    }
```

Here, both Vulnerability issues will be applied to systems `34b9f7d9-fc81-4e0f-bef0-c4b402a1510e` and `9dfe0269-b676-4e15-8bb1-b7003ea00718` whereas the Advisor issue will be applied to `8f87213d-8c00-49a8-a9f5-8295fa39c7e0` only.

### Notifications

In addition, an `onRemediationCreated` callback may be provided.
This callback will be called when the wizard has been completed by the user and a new Remediation has been created.
Information about the new Remediation is available under `result.remediation`.
Optionally, if the application uses [Notifications component](https://github.com/RedHatInsights/frontend-components/blob/master/packages/notifications/doc/notifications.md) a notification informing of successful remediation creation is provided under `result.getNotification()`

```JSX
    onCreated (result) {
        dispatchAction(addNotification(result.getNotification()));
    }
```

## Hot-loading the Wizard directly
Should the `<RemediationButton/>` component not fit for some reason Remediation Wizard can be used directly.

The component is exposed with federated modules, so all you have to do is load `RemediationWizard` module from `remediations` app. You will have to control the visibility of remediations wizard on your side, hence the `useState` 

```JSX
import React from 'react';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const MyCmp = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div>
        <button onClick={() => setIsOpen(true)}>Show remediations wizard</button>
        {isOpen && <AsyncComponent
          appName="remediations"
          module="./RemediationWizard"
          setOpen={(isOpen) => setIsOpen(isOpen)}
          data={{
            issues: [{
              id: `vulnerabilities:${this.state.cveName}` // TODO: modify as needed based on user selection
            }],
            systems: ['34b9f7d9-fc81-4e0f-bef0-c4b402a1510e'], // modify as needed (e.g. based on user selection of system checkboxes in data table)
            onRemediationCreated: (data) => console.log(data)
          }}
        />}
      </div>
    );
};

export default MyCmp;

```
