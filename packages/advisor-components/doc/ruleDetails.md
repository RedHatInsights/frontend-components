# Rule Details

Implementation of the components rendering details about a particular Advisor rule. The component supports two type of rules: for OCP clusters and for RHEL systems.

## Usage

Import RuleDetails from this package.

```JSX
import React from 'react';
import { Link } from 'react-router-dom';
import {
  RuleDetails,
  RuleDetailsMessagesKeys,
  AdvisorProduct
} from '@redhat-cloud-services/frontend-components-advisor-components';

...

const Component = () => (
  <RuleDetails
    messages={messages}
    product={AdvisorProduct.rhel}
    rule={rule}
    resolutionRisk={2}
    resolutionRiskDesc={resolutionRiskLowDescription}
    linkComponent={Link}
    knowledgebaseUrl={`https://access.redhat.com/node/${rule.node_id}`} />
    showViewAffected
);

```

## Properties

The component TS interface is described in [RuleDetails.tsx](../src/RuleDetails/RuleDetails.tsx).

```ts
interface RuleDetailsProps {
  messages: RuleDetailsMessages;
  product: AdvisorProduct;
  rule: RuleContentOcp | RuleContentRhel;
  resolutionRisk?: number;
  resolutionRiskDesc?: string;
  header?: React.ReactNode;
  isDetailsPage: boolean;
  topics: TopicRhel[];
  /**
   * onVoteClick - a callback used to update the rating of a particular rule
   * @param {string} ruleId - ID (usually in plugin|error_key format) of the rule that needs to be updated
   * @param {number} newRating rating (-1, 0, 1)
   */
  onVoteClick?: (ruleId: string, calculatedRating: Rating) => unknown;
  showViewAffected?: boolean;
  linkComponent?: any;
  knowledgebaseUrl?: string;
}
```

* `messages`: a JS object that contains your translations of strings used in this component.
* `product`: tells to which product (OCP, RHEL) the provided rule is written for.
* `header`: React component that renders the header section.
* `isDetailsPage`: set to false if less details needed.
* `showViewAffected`: if true, the rule details will render a "View affected" button. The button navigates to `/recommendations/{id}` path once clicked.
* `linkComponent`: react-router-dom Link component. Use it with combination of `showViewAffected` set to true.