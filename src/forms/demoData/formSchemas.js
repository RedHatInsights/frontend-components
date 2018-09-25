export const simple = {
    title: 'A registration form',
    description: 'A simple form example.',
    type: 'object',
    required: [
        'firstName',
        'lastName'
    ],
    properties: {
        firstName: {
            type: 'string',
            title: 'First name'
        },
        lastName: {
            type: 'string',
            title: 'Last name'
        },
        age: {
            type: 'integer',
            title: 'Age'
        },
        bio: {
            type: 'string',
            title: 'Bio'
        },
        password: {
            type: 'string',
            title: 'Password',
            minLength: 3
        },
        telephone: {
            type: 'string',
            title: 'Telephone',
            minLength: 10
        }
    }
};

export const uiSchemaSimple = {
    firstName: {
        'ui:autofocus': true,
        'ui:emptyValue': ''
    },
    age: {
        'ui:widget': 'updown',
        'ui:title': 'Age of person',
        'ui:description': '(earthian year)'
    },
    bio: {
        'ui:widget': 'textarea'
    },
    password: {
        'ui:widget': 'password',
        'ui:help': 'Hint: Make it strong!'
    },
    telephone: {
        'ui:options': {
            inputType: 'tel'
        }
    }
};

/**
 * Lauras form usecases
 */

export const lauraSchema1 = {
    type: 'object',
    required: [ 'title' ],
    properties: {
        title: { type: 'string', title: 'Title', default: 'A new provider' },
        done: { type: 'boolean', title: 'Done?', default: false }
    }
};

export const lauraSchema2 = {
    title: 'Add an Openshift Provider',
    type: 'object',
    properties: {
        name: { title: 'Provider Name', type: 'string' },
        description: { title: 'Description', type: 'string' },
        url: { title: 'URL', type: 'string' },
        verify_ssl: { title: 'Verify SSL', type: 'boolean', default: false }, // eslint-disable-line camelcase
        user: { title: 'User Name', type: 'string', default: '' },
        token: { title: 'Token', type: 'string', default: '' },
        password: { title: 'Password', type: 'string', minlength: 6 }
    },
    required: [ 'name', 'url' ]
};

export const lauraUiSchema = {
    password: {
        'ui:widget': 'password'
    }
};

export const benchmarchUiSchema = {
    '0typnpcsapb': {
        'ui:widget': 'textarea'
    }

};

export const benchmark = {
    title: 'Add an Openshift Provider',
    type: 'object',
    required: [ 'name', 'url' ],
    properties: {
        '0typnpcsapb': { title: 'Provider Name', type: 'string' },
        '0ujxmbpheqp': { title: 'Description', type: 'string' },
        '0igxbbgefiy': { title: 'URL', type: 'string' },
        '0ymxsbbnvhr': { title: 'Verify SSL', type: 'boolean', default: false },
        '0sinrdrawrc': { title: 'Token', type: 'string', default: '' },
        '0pzhrzaqlev': { title: 'Provider Name', type: 'string' },
        '0grbumqfbdf': { title: 'Password', type: 'string', minlength: 6 },
        '1xbwrkocghx': { title: 'Provider Name', type: 'string' },
        '1jlnvrdletr': { title: 'Description', type: 'string' },
        '1nutqqzmmdl': { title: 'URL', type: 'string' },
        '1otfcpssbia': { title: 'Verify SSL', type: 'boolean', default: false },
        '1qoekvwtlxh': { title: 'Token', type: 'string', default: '' },
        '1bznwozzuel': { title: 'Provider Name', type: 'string' },
        '1uukcsggjcw': { title: 'Password', type: 'string', minlength: 6 },
        '2hbxarbsnwl': { title: 'Provider Name', type: 'string' },
        '2zrdrvfjfgn': { title: 'Description', type: 'string' },
        '2lmtpcpntqh': { title: 'URL', type: 'string' },
        '2tdrxrquqgh': { title: 'Verify SSL', type: 'boolean', default: false },
        '2roloctixhv': { title: 'Token', type: 'string', default: '' },
        '2rthxazlwbs': { title: 'Provider Name', type: 'string' },
        '2istklqsvxq': { title: 'Password', type: 'string', minlength: 6 },
        '3qbmuzkgmdd': { title: 'Provider Name', type: 'string' },
        '3qixbhoqwoa': { title: 'Description', type: 'string' },
        '3psewlqfnhw': { title: 'URL', type: 'string' },
        '3dzssevqlpb': { title: 'Verify SSL', type: 'boolean', default: false },
        '3mgaabkzwah': { title: 'Token', type: 'string', default: '' },
        '3kfbulbogxh': { title: 'Provider Name', type: 'string' },
        '3vmgsbhioqu': { title: 'Password', type: 'string', minlength: 6 },
        '4qpabiveask': { title: 'Provider Name', type: 'string' },
        '4jjnmcfdebp': { title: 'Description', type: 'string' },
        '4nbqouebuuk': { title: 'URL', type: 'string' },
        '4nfdevtvlrq': { title: 'Verify SSL', type: 'boolean', default: false },
        '4warabfuopr': { title: 'Token', type: 'string', default: '' },
        '4kxvvchpfeb': { title: 'Provider Name', type: 'string' },
        '4zovuggbhmp': { title: 'Password', type: 'string', minlength: 6 },
        '5xamdsohpad': { title: 'Provider Name', type: 'string' },
        '5nwfngvzrbh': { title: 'Description', type: 'string' },
        '5jsrsailgee': { title: 'URL', type: 'string' },
        '5whshmgodbt': { title: 'Verify SSL', type: 'boolean', default: false },
        '5pvvpckxzft': { title: 'Token', type: 'string', default: '' },
        '5nygowqcane': { title: 'Provider Name', type: 'string' },
        '5uevjqepatw': { title: 'Password', type: 'string', minlength: 6 },
        '6dpwkmlvdgt': { title: 'Provider Name', type: 'string' },
        '6tytrqcbetf': { title: 'Description', type: 'string' },
        '6kxxqxkedjl': { title: 'URL', type: 'string' },
        '6doprxmshog': { title: 'Verify SSL', type: 'boolean', default: false },
        '6zogeyyhleg': { title: 'Token', type: 'string', default: '' },
        '6imkionlcyk': { title: 'Provider Name', type: 'string' },
        '6fxxzhadqjn': { title: 'Password', type: 'string', minlength: 6 },
        '7uoxkyrrlzg': { title: 'Provider Name', type: 'string' },
        '7fqloslcdqm': { title: 'Description', type: 'string' },
        '7ysyghwfzda': { title: 'URL', type: 'string' },
        '7jpfvmjwqwt': { title: 'Verify SSL', type: 'boolean', default: false },
        '7usmfgpmeai': { title: 'Token', type: 'string', default: '' },
        '7tadcixfvfs': { title: 'Provider Name', type: 'string' },
        '7xmsikczfor': { title: 'Password', type: 'string', minlength: 6 },
        '8fahorsvlzj': { title: 'Provider Name', type: 'string' },
        '8vtptnyzxyx': { title: 'Description', type: 'string' },
        '8selkjedxna': { title: 'URL', type: 'string' },
        '8hziaaotznr': { title: 'Verify SSL', type: 'boolean', default: false },
        '8ypgtvdydfy': { title: 'Token', type: 'string', default: '' },
        '8pjfinvezwm': { title: 'Provider Name', type: 'string' },
        '8hxpuxrsotp': { title: 'Password', type: 'string', minlength: 6 },
        '9wlnegsvtzh': { title: 'Provider Name', type: 'string' },
        '9kgtpnqkjpu': { title: 'Description', type: 'string' },
        '9kozehumfdb': { title: 'URL', type: 'string' },
        '9wielcalalv': { title: 'Verify SSL', type: 'boolean', default: false },
        '9euladfeygy': { title: 'Token', type: 'string', default: '' },
        '9nsdbjfdhfo': { title: 'Provider Name', type: 'string' },
        '9ssxbbsmiey': { title: 'Password', type: 'string', minlength: 6 }
    }
};
