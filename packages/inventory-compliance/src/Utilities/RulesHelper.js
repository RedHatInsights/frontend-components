const combineDuplicateRules = (rules, selectedRefIds) => {
    let rulesWithPolicies = [];
    rules.forEach((rule) => {
        const existingRule = rulesWithPolicies.filter((erule) => (erule.refId === rule.refId))[0];

        if (existingRule) {
            rulesWithPolicies[rulesWithPolicies.indexOf(existingRule)] = {
                ...existingRule,
                isSelected: (selectedRefIds || []).includes(rule.refId),
                policies: [
                    ...existingRule.policies,
                    ...rule.policies
                ]
            };
        } else {
            rulesWithPolicies.push(rule);
        }
    });
    return rulesWithPolicies;
};

export const toRulesArray = (policiesWithRules, selectedRefIds) => {
    const rules = policiesWithRules.flatMap((policy) => (
        policy.rules.map((rule) => (
            {
                ...rule,
                references: rule.references ? JSON.parse(rule.references) : [],
                identifier: rule.identifier ? JSON.parse(rule.identifier) : [],
                policies: [ policy.profile ],
                isOpen: false,
                isSelected: (selectedRefIds || []).includes(rule.refId)
            }
        ))
    ));
    return combineDuplicateRules(rules, selectedRefIds);
};
