
import validate from './validator';
import RemediationWizard, { getMountedInstance } from './RemediationWizard';

export { RemediationWizard };

export function openWizard (data, basePath) {
    const instance = getMountedInstance ();

    if (!instance) {
        throw new Error('Wizard component not mounted');
    }

    validate(data);

    return instance.openWizard(data, basePath);
}
