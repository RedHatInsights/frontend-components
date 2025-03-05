import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Stack } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import { StackItem } from '@patternfly/react-core/dist/dynamic/layouts/Stack';
import sanitizeHtml from 'sanitize-html';

import './truncate.scss';

const dangerousHtml = (html: string) => ({ __html: sanitizeHtml(html) });

export interface TruncateProps {
  className?: string;
  text?: string;
  length?: number;
  expandText?: React.ReactNode;
  collapseText?: React.ReactNode;
  inline?: boolean;
  spaceBetween?: boolean;
  hideExpandText?: boolean;
  expandOnMouseOver?: boolean;
}

/**
 * @deprecated Do not use deprecated Truncate import, use an example from @patternfly/react-component-groups migration guide instead
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Truncate: React.FunctionComponent<TruncateProps> = ({
  text = '',
  length = 150,
  expandText = 'Read more',
  hideExpandText = false,
  expandOnMouseOver = false,
  collapseText = 'Collapse',
  className,
  inline,
  spaceBetween,
}) => {
  const truncateClasses = classNames('ins-c-truncate', className, { [`is-inline`]: inline }, { [`is-block`]: !inline });
  const trimmedText = text.substring(0, length);
  const textOverflow = text.length > length;
  const [showText, setShowText] = useState(false);
  const toggleText = (event: React.MouseEvent<HTMLButtonElement>) => {
    event && event.preventDefault();
    setShowText(!showText);
  };

  const expandButton = (
    <Button className="ins-c-expand-button" variant="link" onClick={toggleText}>
      {expandText}
    </Button>
  );
  const collapseButton = (
    <Button className="ins-c-collapse-button" variant="link" onClick={toggleText}>
      {collapseText}
    </Button>
  );
  const textWithOverflow = showText === false ? `${trimmedText}${textOverflow ? '...' : ''}` : text;
  const html = dangerousHtml(textWithOverflow);
  const mouseOverHandler = expandOnMouseOver && {
    onMouseEnter: () => setShowText(true),
    onMouseLeave: () => setShowText(false),
  };

  return inline ? (
    <React.Fragment>
      <span className={truncateClasses} widget-type="InsightsTruncateInline" dangerouslySetInnerHTML={html} {...mouseOverHandler} />
      {!hideExpandText && textOverflow && (showText === false ? expandButton : collapseButton)}
    </React.Fragment>
  ) : (
    <Stack className={truncateClasses}>
      <StackItem {...mouseOverHandler}>
        <span widget-type="InsightsTruncateBlock" dangerouslySetInnerHTML={html} />
      </StackItem>
      {!hideExpandText && textOverflow && (
        <StackItem
          className={classNames({
            'pf-v6-u-mt-sm': spaceBetween,
          })}
        >
          {showText === false ? expandButton : collapseButton}
        </StackItem>
      )}
    </Stack>
  );
};

export default Truncate;
