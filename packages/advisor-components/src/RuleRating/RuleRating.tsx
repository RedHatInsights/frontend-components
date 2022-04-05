import './RuleRating.scss';

import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import OutlinedThumbsDownIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-down-icon';
import OutlinedThumbsUpIcon from '@patternfly/react-icons/dist/js/icons/outlined-thumbs-up-icon';
import ThumbsDownIcon from '@patternfly/react-icons/dist/js/icons/thumbs-down-icon';
import ThumbsUpIcon from '@patternfly/react-icons/dist/js/icons/thumbs-up-icon';
import messages from '../messages';
import { Rating } from '../types';

interface RuleRatingProps {
  ruleId: string;
  ruleRating: Rating;
  onVoteClick: (ruleId: string, calculatedRating: Rating) => unknown;
}

const RuleRating: React.FC<RuleRatingProps> = ({ ruleId, ruleRating, onVoteClick }) => {
  const intl = useIntl();
  const [rating, setRating] = useState(ruleRating);
  const [submitted, setSubmitted] = useState(false);
  const [thankYou, setThankYou] = useState(intl.formatMessage(messages.feedbackThankYou));

  const updateRuleRating = async (newRating: Rating) => {
    const calculatedRating = rating === newRating ? 0 : newRating;
    try {
      await onVoteClick(ruleId, calculatedRating);
      setRating(calculatedRating);
      setSubmitted(true);
      setTimeout(() => setThankYou(''), 3000);
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  };

  return (
    <span className="ratingSpanOverride">
      {intl.formatMessage(messages.ruleHelpful)}
      <Button variant="plain" aria-label="thumbs-up" onClick={() => updateRuleRating(1)} ouiaId="thumbsUp">
        {rating === 1 ? <ThumbsUpIcon className="like" size="sm" /> : <OutlinedThumbsUpIcon size="sm" />}
      </Button>
      <Button variant="plain" aria-label="thumbs-down" onClick={() => updateRuleRating(-1)} ouiaId="thumbsDown">
        {rating === -1 ? <ThumbsDownIcon className="dislike" size="sm" /> : <OutlinedThumbsDownIcon size="sm" />}
      </Button>
      {submitted && thankYou}
    </span>
  );
};

export default RuleRating;
