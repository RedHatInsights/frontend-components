import React from 'react';

import { Message } from '../RuleDetails/RuleDetailsMessages';
import { AdvisorProduct, RuleContentOcp, RuleContentRhel } from '../types';

interface ViewAffectedLinkProps {
  messages: {
    viewAffectedClusters: Message;
    viewAffectedSystems: Message;
  };
  product: AdvisorProduct;
  rule: RuleContentOcp | RuleContentRhel;
  linkComponent: any;
}

const ViewAffectedLink = ({ messages, product, rule, linkComponent: Link }: ViewAffectedLinkProps) => (
  <React.Fragment>
    {product === AdvisorProduct.ocp
      ? (rule as RuleContentOcp).impacted_clusters_count > 0 && (
          <Link key={`${rule.rule_id}-link`} to={`/recommendations/${rule.rule_id}`}>
            {messages.viewAffectedClusters}
          </Link>
        )
      : (rule as RuleContentRhel).impacted_systems_count > 0 && (
          <Link key={`${rule.rule_id}-link`} to={`/recommendations/${rule.rule_id}`}>
            {messages.viewAffectedSystems}
          </Link>
        )}
  </React.Fragment>
);

export default ViewAffectedLink;
