
import validate from './validator';
import RemediationWizard, { getMountedInstance } from './RemediationWizard';

export { RemediationWizard };

export function openWizard (data, basePath) {
    const instance = getMountedInstance ();

    if (!instance) {
        throw new Error('Wizard component not mounted');
    }

    // TODO: for backwards compatibility; remove once apps are upgraded
    data.issues.forEach(issue => issue.description = issue.description || issue.id);

    validate(data);

    return instance.openWizard(data, basePath);
}
