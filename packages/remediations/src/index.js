
import validate from './validator';
import RemediationWizard from './RemediationWizard';
import NewRemediationWizard from './NewRemediationWizard';
export { RemediationWizard, NewRemediationWizard };

export function openWizard(data, basePath, wizardRef) {

    if (!wizardRef.current) {
        throw new Error('Wizard component not mounted');
    }

    validate(data);

    return wizardRef.current?.openWizard(data, basePath);
}
