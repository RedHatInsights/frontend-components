function assert (test, msg) {
    if (!test) {
        throw new TypeError(msg);
    }
}

function checkAllowedKeys(reference, ...keys) {
    Object.keys(reference).forEach(key => assert(keys.includes(key), `Unexpected key: ${key} Expected one of: ${keys}`));
}

function checkRequiredKeys(reference, ...keys) {
    keys.forEach(key => assert(reference.hasOwnProperty(key), `Required key missing: ${key}`));
}

function checkSystems (systems) {
    assert(Array.isArray(systems), 'Systems must be an array');
    assert(systems.length, 'Systems array must not be empty');
    systems.forEach(system => assert(typeof system === 'string', 'System must be of type string'));
}

export default function validate (data) {
    assert(typeof data === 'object' && data !== null);
    checkAllowedKeys(data, 'issues', 'systems');
    checkRequiredKeys(data, 'issues');

    assert(Array.isArray(data.issues), 'Issues must be an array');
    assert(data.issues.length, 'Issues array must not be empty');
    data.issues.forEach(issue => {
        assert(typeof issue === 'object' && issue !== null, 'Issue must be an object');
        checkAllowedKeys(issue, 'id', 'description', 'systems');
        checkRequiredKeys(issue, 'id', 'description');
        issue.hasOwnProperty('systems') && checkSystems(issue.systems);
        assert(issue.hasOwnProperty('systems') || data.hasOwnProperty('systems'), `No systems defined for ${issue.id}`);
    });

    data.hasOwnProperty('systems') && checkSystems(data.systems);
}
