const appendProfileToDuplicates = (rules) => {
    let rulesWithPoliciesAppended = [];
    rules.forEach((rule) => {
        const existingRule = rulesWithPoliciesAppended.filter((erule) => (erule.refId === rule.refId))[0];
        const newRule = existingRule ? {
            ...existingRule,
            ...rule,
            title: `${existingRule.title}, ${rule.policies[0].name}`,
            policies: [
                ...rule.policies
            ]
        } : rule;

        rulesWithPoliciesAppended.push(newRule);
    });
    return rulesWithPoliciesAppended;
};

export const toRulesArray = (policiesWithRules) => {
    const rules = policiesWithRules.flatMap((policy) => (
        policy.rules.map((rule) => {
            return {
                ...rule,
                rowKey: `${rule.refId}${policy.profile ? `-${policy.profile.refId}` : '' }`,
                references: rule.references ? JSON.parse(rule.references) : [],
                identifier: rule.identifier ? JSON.parse(rule.identifier) : [],
                policies: [ policy.profile ],
                isOpen: false
            };
        })
    ));
    return appendProfileToDuplicates(rules);
};
