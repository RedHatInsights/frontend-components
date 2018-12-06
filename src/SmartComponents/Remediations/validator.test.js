import validate from './validator';

function validData () {
    return {
        issues: [{
            id: 'advisor:network_bond_opts_config_issue|NETWORK_BONDING_OPTS_DOUBLE_QUOTES_ISSUE'
        }, {
            id: 'vulnerabilities:CVE_2017_6074_kernel|KERNEL_CVE_2017_6074'
        }, {
            id: 'vulnerabilities:CVE-2017-17713'
        }],
        systems: [
            '8e7d7f5f-160c-40cc-859c-a3e479007dce',
            '1fb1e94d-aa02-4824-9307-b2aff9d788a3',
            '3c3d725e-cbf0-4dac-a40f-4e7f027bcdc9'
        ]
    }
}

describe('validator', function () {
    it('passed on valid data', () => {
        validate(validData());
    });

    it('fails when issues missing', () => {
        const data = validData();
        delete data.issues;

        expect(() => validate(data)).toThrow(TypeError);
    });

    it('fails when issues empty', () => {
        const data = validData();
        data.issues = [];

        expect(() => validate(data)).toThrow(TypeError);
    });

    it('fails when issues not array', () => {
        const data = validData();
        data.issues = {};

        expect(() => validate(data)).toThrow(TypeError);
    });

    it('fails when issue not object', () => {
        const data = validData();
        data.issues[2] = 'foo';

        expect(() => validate(data)).toThrow(TypeError);
    });

    it('fails when issue has unexpected property', () => {
        const data = validData();
        data.issues[2].foo = 'bar';

        expect(() => validate(data)).toThrow(TypeError);
    });

    it('fails when issue missing id', () => {
        const data = validData();
        delete data.issues[2].id;

        expect(() => validate(data)).toThrow(TypeError);
    });

    it('fails when systems missing', () => {
        const data = validData();
        delete data.systems

        expect(() => validate(data)).toThrow(TypeError);
    });

    it('fails when systems empty', () => {
        const data = validData();
        data.systems = [];

        expect(() => validate(data)).toThrow(TypeError);
    });

    it('fails when system of unexpected type', () => {
        const data = validData();
        data.systems[1] = 3;

        expect(() => validate(data)).toThrow(TypeError);
    });

});

