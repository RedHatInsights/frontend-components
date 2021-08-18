// Variables not found in pf-react
export const colorList = {
    default: '#737679', // pf-black-600
    danger: '#a30000', //pf-red-200
    warning: '#f0ab00', //pf-gold-400
    orange: '#ec7a08' // pf-orange-300
};

export const messageList = {
    critical:
        'This rating is given to flaws that could be easily exploited by a \
        remote unauthenticated attacker and lead to system compromise \
        (arbitrary code execution) without requiring user interaction. These \
        are the types of vulnerabilities that can be exploited by worms. \
        Flaws that require an authenticated remote user, a local user, \
        or an unlikely configuration are not classed as Critical impact.',
    important:
        'This rating is given to flaws that can easily compromise the \
    confidentiality, integrity, or availability of resources. These are the \
    types of vulnerabilities that allow local users to gain privileges, allow \
    unauthenticated remote users to view resources that should otherwise be \
    protected by authentication, allow authenticated remote users to execute \
    arbitrary code, or allow remote users to cause a denial of service.',
    moderate:
        'This rating is given to flaws that may be more difficult to exploit \
        but could still lead to some compromise of the confidentiality, \
        integrity, or availability of resources, under certain circumstances. \
        These are the types of vulnerabilities that could have had a Critical \
        impact or Important impact but are less easily exploited based on a \
        technical evaluation of the flaw, or affect unlikely configurations.',
    low:
        'This rating is given to all other issues that have a security \
        impact. These are the types of vulnerabilities that are believed to \
        require unlikely circumstances to be able to be exploited, or where \
        a successful exploit would give minimal consequences.',
    unknown:
        'Red Hat Product Security has determined that this vulnerability does \
        not impact Red Hat products.'
};

/* I'm not shure that the list of impacts is ordered correctly by relevancy */
export const impactList = {
    Critical: {
        title: 'Critical',
        color: colorList.danger,
        message: messageList.critical
    },
    4: {
        title: 'Critical',
        color: colorList.danger,
        message: messageList.critical
    },
    High: {
        title: 'High',
        color: colorList.orange,
        message: messageList.important
    },
    Important: {
        title: 'Important',
        color: colorList.orange,
        message: messageList.important
    },
    3: {
        title: 'High',
        color: colorList.orange,
        message: messageList.important
    },
    Medium: {
        title: 'Medium',
        color: colorList.warning,
        message: messageList.moderate
    },
    Moderate: {
        title: 'Moderate',
        color: colorList.warning,
        message: messageList.moderate
    },
    2: {
        title: 'Medium',
        color: colorList.warning,
        message: messageList.moderate
    },
    Low: {
        title: 'Low',
        color: colorList.default,
        message: messageList.low
    },
    1: {
        title: 'Low',
        color: colorList.default,
        message: messageList.low
    },
    Unknown: {
        title: 'Unknown',
        color: colorList.default,
        message: messageList.unknown
    }
};
