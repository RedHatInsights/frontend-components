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
        return (
            <React.Fragment>
                { this.props.content.length > this.props.maxLength ? (
                    <Tooltip
                        maxWidth={ this.props.tooltipMaxWidth }
                        position={ this.props.tooltipPosition }
                        content={ <div>{ this.props.content }</div> }
                    >
                        <div>{ this.truncate(this.props.content, this.props.maxLength) }</div>
                    </Tooltip>
                ) : (
                    <span>{ this.props.content }</span>
                ) }
            </React.Fragment>
        );
    }
}

LongTextTooltip.defaultProps = {
    content: '',
    maxLength: Infinity,
    tooltipPosition: 'top',
    tooltipMaxWidth: '50vw'
};

LongTextTooltip.propTypes = {
    content: propTypes.string,
    maxLength: propTypes.number,
    tooltipPosition: propTypes.string,
    tooltipMaxWidth: propTypes.string
};

export default LongTextTooltip;
