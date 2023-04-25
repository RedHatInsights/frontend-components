import React from 'react';

import { RuleDetailsMessages } from '../RuleDetails/RuleDetails';
import { AdvisorProduct, RuleContentOcp, RuleContentRhel } from '../types';

interface ViewAffectedLinkProps {
  messages: RuleDetailsMessages;
  product: AdvisorProduct;
  rule: RuleContentOcp | RuleContentRhel;
  linkComponent: any;
}

const ViewAffectedLink: React.FC<ViewAffectedLinkProps> = ({ messages, product, rule, linkComponent: Link }) => (
  <React.Fragment>
    {product === AdvisorProduct.ocp
      ? (rule as RuleContentOcp).impacted_clusters_count > 0 && (
          <Link key={`${rule.rule_id}-link`} to={`/openshift/insights/advisor/recommendations/${rule.rule_id}`}>
            {messages.viewAffectedClusters}
          </Link>
        )
      : (rule as RuleContentRhel).impacted_systems_count > 0 && (
          <Link key={`${rule.rule_id}-link`} to={`/openshift/insights/advisor/recommendations/${rule.rule_id}`}>
            {messages.viewAffectedSystems}
          </Link>
        )}
  </React.Fragment>
);

export default ViewAffectedLink;
