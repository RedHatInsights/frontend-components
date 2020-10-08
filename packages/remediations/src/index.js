
import validate from './validator';
import RemediationWizard from './RemediationWizard';
export { RemediationWizard };

console.log('%c Oh my heavens olala! ', 'background: #222; color: #bada55');

export function openWizard(data, basePath, wizardRef) {

    if (!wizardRef.current) {
        throw new Error('Wizard component not mounted');
    }

    validate(data);

    return wizardRef.current?.openWizard(data, basePath);
}
