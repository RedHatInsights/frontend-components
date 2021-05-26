function router(target) {
    return (req) => {
        switch (req.hostname) {
            case 'ci.foo.redhat.com':    return 'https://ci.cloud.redhat.com/';
            case 'qa.foo.redhat.com':    return 'https://qa.cloud.redhat.com/';
            case 'stage.foo.redhat.com': return 'https://cloud.stage.redhat.com/';
            case 'prod.foo.redhat.com':  return 'https://cloud.redhat.com/';
            default: return target;
        }
    };
}

module.exports = router;
