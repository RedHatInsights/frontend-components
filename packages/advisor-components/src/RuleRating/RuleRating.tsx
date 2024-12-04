import './RuleRating.scss';

import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Icon } from '@patternfly/react-core/dist/dynamic/components/Icon';
import OutlinedThumbsDownIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-thumbs-down-icon';
import OutlinedThumbsUpIcon from '@patternfly/react-icons/dist/dynamic/icons/outlined-thumbs-up-icon';
import ThumbsDownIcon from '@patternfly/react-icons/dist/dynamic/icons/thumbs-down-icon';
import ThumbsUpIcon from '@patternfly/react-icons/dist/dynamic/icons/thumbs-up-icon';

import { Rating } from '../types';
import { RuleDetailsMessages } from '../RuleDetails/RuleDetailsMessages';

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
      <Button
        icon={<Icon size="md">{rating === 1 ? <ThumbsUpIcon className="ins-c-like" /> : <OutlinedThumbsUpIcon />}</Icon>}
        variant="plain"
        aria-label="thumbs-up"
        onClick={() => updateRuleRating(1)}
        ouiaId="thumbsUp"
      />
      <Button
        icon={<Icon size="md">{rating === -1 ? <ThumbsDownIcon className="ins-c-dislike" /> : <OutlinedThumbsDownIcon />}</Icon>}
        variant="plain"
        aria-label="thumbs-down"
        onClick={() => updateRuleRating(-1)}
        ouiaId="thumbsDown"
      />
      {submitted && messages.feedbackThankYou}
    </span>
  );
};

export default RuleRating;
