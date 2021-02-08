import { compileAllApplicationComboOptions } from '../../addSourceWizard/compileAllApplicationComboOptions';
import { CLOUD_VENDOR, NO_APPLICATION_VALUE, REDHAT_VENDOR } from '../../utilities/stringConstants';

describe('compileAllApplicationComboOptions', () => {
    let tmpLocation;

    const mockAppTypes = [
        { name: 'app', display_name: 'Application', id: '1' }
    ];

    const INTl = { formatMessage: ({ defaultMessage }) => defaultMessage };

    beforeEach(() => {
        tmpLocation = Object.assign({}, window.location);

        delete window.location;

        window.location = {};
    });

    afterEach(() => {
        window.location = tmpLocation;
    });

    it('cloud type selection - has none application', () => {
        window.location.search = `activeVendor=${CLOUD_VENDOR}`;

        expect(compileAllApplicationComboOptions(mockAppTypes, INTl)).toEqual(
            [{ label: 'Application', value: '1', description: undefined }, { label: 'No application', value: NO_APPLICATION_VALUE }]
        );
    });

    it('red hat type selection - is none', () => {
        window.location.search = `activeVendor=${REDHAT_VENDOR}`;

        expect(compileAllApplicationComboOptions(mockAppTypes, INTl)).toEqual(
            [{ label: 'Application', value: '1', description: undefined }]
        );
    });
});
