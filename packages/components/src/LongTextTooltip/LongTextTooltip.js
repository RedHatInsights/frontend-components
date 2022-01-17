import { Tooltip } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';

class LongTextTooltip extends React.Component {
  constructor(props) {
    super(props);
  }

  truncate(str, max) {
    return str.length > max ? str.substr(0, max - 1) + '…' : str;
  }

  render() {
    const { content, maxLength, tooltipMaxWidth, tooltipPosition, ...rest } = this.props;
    return (
      <React.Fragment>
        {content.length > maxLength ? (
          <Tooltip maxWidth={tooltipMaxWidth} position={tooltipPosition} content={<div>{content}</div>} {...rest}>
            <div>{this.truncate(content, maxLength)}</div>
          </Tooltip>
        ) : (
          <span>{content}</span>
        )}
      </React.Fragment>
    );
  }
}

LongTextTooltip.defaultProps = {
  content: '',
  maxLength: Infinity,
  tooltipPosition: 'top',
  tooltipMaxWidth: '50vw',
};

LongTextTooltip.propTypes = {
  content: propTypes.string,
  maxLength: propTypes.number,
  tooltipPosition: propTypes.string,
  tooltipMaxWidth: propTypes.string,
};

export default LongTextTooltip;
