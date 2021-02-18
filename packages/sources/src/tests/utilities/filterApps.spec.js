import applicationTypes from '../helpers/applicationTypes';
import filterApps, { filterVendorAppTypes, TOPOLOGY_INV_NAME } from '../../utilities/filterApps';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/stringConstants';

describe('filterApps', () => {
    it('filters topology invetory app from app types', () => {
        const appTypes = applicationTypes;

        expect(appTypes.find(({ name }) => name === TOPOLOGY_INV_NAME)).toBeDefined();

        expect(appTypes.filter(filterApps).find(({ name }) => name === TOPOLOGY_INV_NAME)).toBeUndefined();
    });

    describe('vendor filter', () => {
        let tmpLocation;

        const sourceTypesVendors = [
            { id: '1', name: 'azure', vendor: 'Microsoft' },
            { id: '2', name: 'aws', vendor: 'amazon' },
            { id: '3', name: 'openshift', vendor: 'Red Hat' },
            { id: '4', name: 'vmware', vendor: 'vmware' }
        ];

        const appTypes = [
            { id: '123', name: 'cost', supported_source_types: [ 'aws' ] },
            { id: '13', name: 'sub watch', supported_source_types: [ 'azure' ] },
            { id: '9089', name: 'topology', supported_source_types: [ 'openshift', 'vmware' ] },
            { id: '1', name: 'remediations', supported_source_types: [ 'openshift' ] }
        ];

        beforeEach(() => {
            tmpLocation = Object.assign({}, window.location);

            delete window.location;

            window.location = {};
        });

        afterEach(() => {
            window.location = tmpLocation;
        });

        it('filters CLOUD source types', () => {
            window.location.search = `activeVendor=${CLOUD_VENDOR}`;

            expect(appTypes.filter(filterVendorAppTypes(sourceTypesVendors))).toEqual([
                { id: '123', name: 'cost', supported_source_types: [ 'aws' ] },
                { id: '13', name: 'sub watch', supported_source_types: [ 'azure' ] },
                { id: '9089', name: 'topology', supported_source_types: [ 'openshift', 'vmware' ] }
            ]);
        });

        it('filters CLOUD source types when only cloud source types - when type is not, filter the app', () => {
            const onlyCloudTypes = [
                { id: '1', name: 'azure', vendor: 'Microsoft' },
                { id: '2', name: 'aws', vendor: 'amazon' },
                { id: '4', name: 'vmware', vendor: 'vmware' }
            ];

            window.location.search = `activeVendor=${CLOUD_VENDOR}`;

            expect(appTypes.filter(filterVendorAppTypes(onlyCloudTypes))).toEqual([
                { id: '123', name: 'cost', supported_source_types: [ 'aws' ] },
                { id: '13', name: 'sub watch', supported_source_types: [ 'azure' ] },
                { id: '9089', name: 'topology', supported_source_types: [ 'openshift', 'vmware' ] }
            ]);
        });

        it('filters RED HAT source types', () => {
            window.location.search = `activeVendor=${REDHAT_VENDOR}`;

            expect(appTypes.filter(filterVendorAppTypes(sourceTypesVendors))).toEqual([
                { id: '9089', name: 'topology', supported_source_types: [ 'openshift', 'vmware' ] },
                { id: '1', name: 'remediations', supported_source_types: [ 'openshift' ] }
            ]);
        });
    });
});
