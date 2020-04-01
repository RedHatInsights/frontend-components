const appendProfileToDuplicates = (rules, selectedRefIds) => {
    let rulesWithPoliciesAppended = [];
    rules.forEach((rule) => {
        const existingRule = rulesWithPoliciesAppended.filter((erule) => (erule.refId === rule.refId))[0];

        const newRule = existingRule ? {
            ...existingRule,
            title: `${existingRule.title}, ${rule.policies[0].name}`,
            refId: `${existingRule.refId}-${rule.policies[0].refId}`,
            isSelected: (selectedRefIds || []).includes(rule.refId),
            policies: [
                ...rule.policies
            ]
        } : rule;

        rulesWithPoliciesAppended.push(newRule);
    });
    return rulesWithPoliciesAppended;
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
    return appendProfileToDuplicates(rules, selectedRefIds);
};
