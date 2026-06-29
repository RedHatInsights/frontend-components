import React from 'react';
import AnsiblePF, { AnsibleProps } from '@patternfly/react-component-groups/dist/dynamic/Ansible';

/**
 * @deprecated Do not use deprecated Ansible import, the component has been moved to @patternfly/react-component-groups
 */

const Ansible = (props: AnsibleProps) => <AnsiblePF {...props} />;

export default Ansible;
