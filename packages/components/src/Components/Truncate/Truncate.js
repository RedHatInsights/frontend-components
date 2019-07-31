import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import { Button, Stack, StackItem } from '@patternfly/react-core';

import './truncate.scss';

import sanitizeHtml from 'sanitize-html';

class Truncate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showText: false
        };
        this.toggleText = this.toggleText.bind(this);
    }

    toggleText (event) {
        event && event.preventDefault();
        this.setState({
            showText: !this.state.showText
        });
    }

    dangerousHtml(text) {
        return { __html: sanitizeHtml(text) };
    }

    render() {

        const truncateClasses = classNames(
            'ins-c-truncate',
            this.props.className,
            { [`is-inline`]: this.props.inline },
            { [`is-block`]: !this.props.inline }
        );

        const trimmedText = this.props.text.substring(0, this.props.length);

        const textOverflow = this.props.text.length > this.props.length;

        const { showText } = this.state;

        const expandButton =
            <Button
                className='ins-c-expand-button'
                variant='link'
                onClick={ this.toggleText }>
                { this.props.expandText }
            </Button>;

        const collapseButton =
            <Button
                className='ins-c-collapse-button'
                variant='link'
                onClick={ this.toggleText }>
                { this.props.collapseText }
            </Button>;

        if (this.props.inline) {
            return (
                <React.Fragment>
                    <span
                        className={ truncateClasses }
                        widget-type='InsightsTruncateInline'
                        dangerouslySetInnerHTML={ this.dangerousHtml(showText === false ? `${trimmedText}${textOverflow ? '...' : '' }`
                            : this.props.text) } />
                    { textOverflow && (showText === false ? expandButton : collapseButton) }
                </React.Fragment>
            );
        } else {
            return (
                <Stack className={ truncateClasses }>
                    <StackItem>
                        <span
                            widget-type='InsightsTruncateBlock'
                            dangerouslySetInnerHTML={ this.dangerousHtml(showText === false ? `${trimmedText}${textOverflow ? '...' : '' }`
                                : this.props.text) } />
                    </StackItem>
                    { textOverflow && <StackItem>
                        { showText === false ? expandButton : collapseButton }
                    </StackItem>
                    }
                </Stack>
            );
        }
    }
};

export default Truncate;

Truncate.propTypes = {
    className: propTypes.string,
    text: propTypes.string,
    length: propTypes.number,
    expandText: propTypes.string,
    collapseText: propTypes.string,
    inline: propTypes.bool
};

Truncate.defaultProps = {
    length: 150,
    expandText: 'Read more',
    collapseText: 'Collapse',
    text: ''
};
