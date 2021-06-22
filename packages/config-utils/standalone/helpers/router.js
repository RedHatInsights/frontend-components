function router(target, useCloud) {
    return (req) => {
        switch (req.hostname) {
            case 'ci.foo.redhat.com':    return `https://ci.${useCloud ? 'cloud' : 'console'}.redhat.com/`;
            case 'qa.foo.redhat.com':    return `https://qa.${useCloud ? 'cloud' : 'console'}.redhat.com/`;
            case 'stage.foo.redhat.com': return `https://${useCloud ? 'cloud' : 'console'}.stage.redhat.com/`;
            case 'prod.foo.redhat.com':  return `https://${useCloud ? 'cloud' : 'console'}.redhat.com/`;
            default: return target;
        }
    };
}

module.exports = router;
