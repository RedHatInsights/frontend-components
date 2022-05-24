import React from 'react';
import compact from 'lodash/compact';
import intersection from 'lodash/intersection';

import { RuleContentRhel, TopicRhel } from './types';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

// eslint-disable-next-line no-undef
export const barDividedList = (list: JSX.Element[]) =>
  list.map((element, index) => (
    <React.Fragment key={index}>
      {element}
      {index + 1 !== list.length && <strong className="verticalDivider">&nbsp;&#124;&nbsp;</strong>}
    </React.Fragment>
  ));

export const topicLinks = (rule: RuleContentRhel, topics: TopicRhel[], Link: any) =>
  topics
    ? compact(
        topics.map(
          (topic) =>
            intersection(topic.tag.split(' '), rule.tags.split(' ')).length && (
              <Link key={topic.slug} to={`/topics/${topic.slug}`}>{`${topic.name}`}</Link>
            )
        )
      )
    : [];

export const ExternalLink = ({ href, content }: { href: string; content: string }) => (
  <a rel="noopener noreferrer" target="_blank" href={href}>
    {content} <ExternalLinkAltIcon />
  </a>
);
