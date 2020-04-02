export const toRulesArray = (policiesWithRules) => {
    const rules = policiesWithRules.flatMap((policy) => (
        policy.rules.map((rule) => {
            const identifier = rule.identifier && JSON.parse(rule.identifier);
            return {
                ...rule,
                rowKey: `${rule.refId}${policy.profile ? `-${policy.profile.refId}` : '' }`,
                references: rule.references ? JSON.parse(rule.references) : [],
                identifier: identifier && identifier.label ? identifier : null,
                policies: [ policy.profile ]
            };
        })
    ));
    return rules;
};
