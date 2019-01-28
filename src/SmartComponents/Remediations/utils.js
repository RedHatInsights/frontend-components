import urijs from 'urijs';

export function remediationUrl (id) {
    return urijs(document.baseURI).segment('platform').segment('remediations').segment(id).toString();
}
