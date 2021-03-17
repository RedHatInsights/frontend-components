
import validate from './validate';
import RemediationWizard from './RemediationWizard';
export { RemediationWizard };

export function openWizard(data, basePath, wizardRef) {

    if (!wizardRef.current) {
        throw new Error('Wizard component not mounted');
    }

    validate(data);

    return wizardRef.current?.openWizard(data, basePath);
}
