import urijs from 'urijs';

// Get the current group since we can be mounted at two urls
export function getGroup () {
    const pathName = window.location.pathname.split('/');

    if (pathName[1] === 'beta') {
        return pathName[2];
    }

    return pathName[1];
}

export function remediationUrl (id) {
    return urijs(document.baseURI).segment(getGroup()).segment('remediations').segment(id).toString();
}

export const CAN_REMEDIATE = 'remediations:remediation:write';

export const AUTO_REBOOT = 'auto-reboot';
export const HAS_MULTIPLES = 'has-multiples';
export const SELECT_PLAYBOOK = 'select-playbook';
export const SELECTED_RESOLUTIONS = 'selected-resolutions';
export const MANUAL_RESOLUTION = 'manual-resolution';
export const EXISTING_PLAYBOOK_SELECTED = 'existing-playbook-selected';
export const EXISTING_PLAYBOOK = 'existing-playbook';
