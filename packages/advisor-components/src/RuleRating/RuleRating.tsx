import './RuleRating.scss';

import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import OutlinedThumbsDownIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-down-icon';
import OutlinedThumbsUpIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-up-icon';
import ThumbsDownIcon from '@patternfly/react-icons/dist/js/icons/thumbs-down-icon';
import ThumbsUpIcon from '@patternfly/react-icons/dist/js/icons/thumbs-up-icon';

import { Rating } from '../types';
import { RuleDetailsMessages } from '../RuleDetails/RuleDetails';

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
    }, 2000),
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
        {rating === 1 ? <ThumbsUpIcon className="ins-c-like" size="sm" /> : <OutlinedThumbsUpIcon size="sm" />}
      </Button>
      <Button variant="plain" aria-label="thumbs-down" onClick={() => updateRuleRating(-1)} ouiaId="thumbsDown">
        {rating === -1 ? <ThumbsDownIcon className="ins-c-dislike" size="sm" /> : <OutlinedThumbsDownIcon size="sm" />}
      </Button>
      {submitted && messages.feedbackThankYou}
    </span>
  );
};

export default RuleRating;
