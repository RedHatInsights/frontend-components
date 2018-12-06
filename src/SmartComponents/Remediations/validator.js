function assert (test, msg) {
    if (!test) {
        throw new TypeError(msg);
    }
}

function checkKeys(reference, ...keys) {
    Object.keys(reference).forEach(key => assert(keys.includes(key), `Unexpected key: ${key} Expected one of: ${keys}`));
    keys.forEach(key => assert(reference.hasOwnProperty(key), `Required key missing: ${key}`));
}

export default function validate (data) {
    assert(typeof data === 'object' && data !== null);
    checkKeys(data, 'issues', 'systems');

    assert(Array.isArray(data.issues), 'Issues must be an array');
    assert(data.issues.length, 'Issues array must not be empty');
    data.issues.forEach(issue => {
        assert(typeof issue === 'object' && issue !== null, 'Issue must be an object');
        checkKeys(issue, 'id');
    });

    assert(Array.isArray(data.systems), 'Systems must be an array');
    assert(data.systems.length, 'Systems array must not be empty');
    data.systems.forEach(system => assert(typeof system === 'string', 'System must be of type string'));
}
