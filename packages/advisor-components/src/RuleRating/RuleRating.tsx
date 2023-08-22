import './RuleRating.scss';

import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

import { Button, Icon } from '@patternfly/react-core';
import { OutlinedThumbsDownIcon, OutlinedThumbsUpIcon, ThumbsDownIcon, ThumbsUpIcon } from '@patternfly/react-icons';

import { Rating } from '../types';
import { RuleDetailsMessages } from '../RuleDetails/RuleDetails';

export const DEBOUNCE_TIMEOUT = 2000;

interface RuleRatingProps {
  ruleId: string;
  ruleRating: Rating;
  onVoteClick: (ruleId: string, calculatedRating: Rating) => unknown;
  messages: RuleDetailsMessages;
}

const RuleRating: React.FC<RuleRatingProps> = ({ messages, ruleId, ruleRating, onVoteClick }) => {
  const [rating, setRating] = useState(ruleRating);
  const [submitted, setSubmitted] = useState(false);

  const triggerCallback = useCallback(
    debounce((calculatedRating) => {
      onVoteClick(ruleId, calculatedRating);
      setSubmitted(false);
    }, DEBOUNCE_TIMEOUT),
    []
  );

  const updateRuleRating = (newRating: Rating) => {
    const calculatedRating = rating === newRating ? 0 : newRating;

    try {
      setSubmitted(true);
      triggerCallback(calculatedRating);
      setRating(calculatedRating);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  return (
    <span className="ratingSpanOverride">
      {messages.ruleHelpful}
      <Button variant="plain" aria-label="thumbs-up" onClick={() => updateRuleRating(1)} ouiaId="thumbsUp">
        <Icon size="md">{rating === 1 ? <ThumbsUpIcon className="ins-c-like" /> : <OutlinedThumbsUpIcon />}</Icon>
      </Button>
      <Button variant="plain" aria-label="thumbs-down" onClick={() => updateRuleRating(-1)} ouiaId="thumbsDown">
        <Icon size="md">{rating === -1 ? <ThumbsDownIcon className="ins-c-dislike" /> : <OutlinedThumbsDownIcon />}</Icon>
      </Button>
      {submitted && messages.feedbackThankYou}
    </span>
  );
};

export default RuleRating;
