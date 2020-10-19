import computeSourceStatus from '../../utilities/computeSourceStatus';

describe('computeSourceStatus', () => {
    let source;

    it('endpoint is unavailable', () => {
        source = {
            endpoint: [{
                availability_status: 'unavailable'
            }]
        };

        expect(computeSourceStatus(source)).toEqual('unavailable');
    });

    it('application is unavailable', () => {
        source = {
            applications: [{
                availability_status: 'unavailable'
            }]
        };

        expect(computeSourceStatus(source)).toEqual('unavailable');
    });

    it('endpoint is available', () => {
        source = {
            endpoint: [{
                availability_status: 'available'
            }]
        };

        expect(computeSourceStatus(source)).toEqual('available');
    });

    it('endpoint is available && applications is timeouted', () => {
        source = {
            endpoint: [{
                availability_status: 'available'
            }],
            applications: [{
                availability_status: 'null'
            }]
        };

        expect(computeSourceStatus(source)).toEqual('timeout');
    });

    it('application is available', () => {
        source = {
            applications: [{
                availability_status: 'available'
            }]
        };

        expect(computeSourceStatus(source)).toEqual('available');
    });

    it('endpoint && application are available', () => {
        source = {
            endpoint: [{
                availability_status: 'available'
            }],
            applications: [{
                availability_status: 'available'
            }]
        };

        expect(computeSourceStatus(source)).toEqual('available');
    });

    it('endpoint is timeouted', () => {
        source = {
            endpoint: [{
                availability_status: null
            }]
        };

        expect(computeSourceStatus(source)).toEqual('timeout');
    });

    it('application is timeouted', () => {
        source = {
            applications: [{
                availability_status: 'null'
            }]
        };

        expect(computeSourceStatus(source)).toEqual('timeout');
    });

    it('returns default', () => {
        source = {};

        expect(computeSourceStatus(source)).toEqual('finished');
    });
});
