import React, { useState } from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Stack, StackItem } from '@patternfly/react-core';
import sanitizeHtml from 'sanitize-html';

import './truncate.scss';

const dangerousHtml = (html) =>
    ({ __html: sanitizeHtml(html) });

const Truncate = ({
    text = '',
    length = 150,
    expandText = 'Read more',
    hideExpandText = false,
    expandOnMouseOver = false,
    collapseText = 'Collapse',
    className,
    inline,
    spaceBetween
}) => {
    const truncateClasses = classNames(
        'ins-c-truncate',
        className,
        { [`is-inline`]: inline },
        { [`is-block`]: !inline }
    );
    const trimmedText = text.substring(0, length);
    const textOverflow = text.length > length;
    const [ showText, setShowText ] = useState(false);
    const toggleText = (event) => {
        event && event.preventDefault();
        setShowText(!showText);
    };

    const expandButton =
        <Button
            className='ins-c-expand-button'
            variant='link'
            onClick={ toggleText }>
            { expandText }
        </Button>;
    const collapseButton =
        <Button
            className='ins-c-collapse-button'
            variant='link'
            onClick={ toggleText }>
            { collapseText }
        </Button>;
    const textWithOverflow = showText === false ? `${trimmedText}${textOverflow ? '...' : '' }` : text;
    const html = dangerousHtml(textWithOverflow);
    const mouseOverHandler = expandOnMouseOver && {
        onMouseEnter: () => setShowText(true),
        onMouseLeave: () => setShowText(false)
    };

    return inline ? <React.Fragment>
        <span
            className={ truncateClasses }
            widget-type='InsightsTruncateInline'
            dangerouslySetInnerHTML={ html }
            { ...mouseOverHandler }
        />
        { !hideExpandText && textOverflow && (showText === false ? expandButton : collapseButton) }
    </React.Fragment> : <Stack className={ truncateClasses }>
        <StackItem { ...mouseOverHandler }>
            <span
                widget-type='InsightsTruncateBlock'
                dangerouslySetInnerHTML={ html } />
        </StackItem>
        { !hideExpandText && textOverflow && <StackItem className={spaceBetween && 'pf-u-mt-sm'}>
            { showText === false ? expandButton : collapseButton }
        </StackItem>
        }
    </Stack>;
};

Truncate.propTypes = {
    className: propTypes.string,
    text: propTypes.string,
    length: propTypes.number,
    expandText: propTypes.string,
    collapseText: propTypes.string,
    inline: propTypes.bool,
    spaceBetween: propTypes.bool,
    hideExpandText: propTypes.bool,
    expandOnMouseOver: propTypes.bool
};

export default Truncate;
