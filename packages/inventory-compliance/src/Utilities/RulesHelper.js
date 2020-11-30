export const toRulesArray = (profilesWithRules) => (
    profilesWithRules.flatMap((profileWithRules) => (
        profileWithRules.rules.map((rule) => {
            const identifier = rule.identifier && JSON.parse(rule.identifier);
            return {
                ...rule,
                rowKey: `${rule.refId}${profileWithRules.profile ? `-${profileWithRules.profile.refId}` : '' }`,
                references: rule.references ? JSON.parse(rule.references) : [],
                identifier: identifier && identifier.label ? identifier : null,
                profiles: [ profileWithRules.profile ]
            };
        })
    ))
);
