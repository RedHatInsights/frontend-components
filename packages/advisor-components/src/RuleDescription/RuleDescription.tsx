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

const RuleDescription: React.FC<RuleDescriptionProps> = ({ product, rule, isDetailsPage }) => (
  <React.Fragment>
    {(rule.generic || rule.summary) && (
      <span className={product === AdvisorProduct.ocp || isDetailsPage ? 'ins-c-generic__override' : ''}>
        <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
          {product === AdvisorProduct.ocp || isDetailsPage ? rule.generic : rule.summary}
        </Markdown>
      </span>
    )}
  </React.Fragment>
);

export default RuleDescription;
