import './RuleDescription.scss';

import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import { AdvisorProduct, RuleContentOcp, RuleContentRhel } from '../types';

interface RuleDescriptionProps {
  product: AdvisorProduct;
  rule: RuleContentOcp | RuleContentRhel;
  isDetailsPage: boolean;
}

const RuleDescription: React.FC<RuleDescriptionProps> = ({ product, rule, isDetailsPage }) => {
  const ruleDescription = (data: string, isGeneric = false) => (
    <React.Fragment>
      {data && (
        <span className={isGeneric ? 'ins-c-generic__override' : ''}>
          <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{data}</Markdown>
        </span>
      )}
    </React.Fragment>
  );

  if (product === AdvisorProduct.ocp) {
    return ruleDescription(rule.generic, true);
  } else {
    // RHEL rule
    return isDetailsPage ? ruleDescription(rule.generic, true) : ruleDescription(rule.summary);
  }
};

export default RuleDescription;
