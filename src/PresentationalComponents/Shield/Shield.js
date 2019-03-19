import { QuestionIcon, SecurityIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import { impactList, colorList } from './consts';

class Shield extends React.Component {
    constructor(props) {
        super(props);
    }

    getColoredBadgeByImpact() {
        const unknownLabel = 'Unknown';
        if (impactList.hasOwnProperty(this.props.impact)) {
            return {
                icon: <SecurityIcon
                    aria-hidden="false"
                    aria-label={ this.props.tooltipPrefix + (this.props.title || impactList[this.props.impact].title) }
                    size={ this.props.size }
                    color={ impactList[this.props.impact].color }
                />,
                title: impactList[this.props.impact].title
            };
        } else {
            return {
                icon: <QuestionIcon
                    aria-hidden="false"
                    aria-label={ this.props.tooltipPrefix + (this.props.title || unknownLabel) }
                    size={ this.props.size }
                    color={ colorList.default }
                />,
                title: unknownLabel
            };
        }
    }

    render() {
        const badge = this.getColoredBadgeByImpact();
        const { tooltipPosition, hasTooltip, tooltipPrefix, title, size, impact, ...rest } = this.props;

        return (
            <React.Fragment>
                { hasTooltip === true ? (
                    <Tooltip
                        position={ tooltipPosition }
                        content={ <div>{ tooltipPrefix + (title || badge.title) }</div> }
                        { ...rest }
                    >
                        { badge.icon }
                    </Tooltip>
                ) : (
                    <span>{ badge.icon }</span>
                ) }
            </React.Fragment>
        );
    }
}

Shield.defaultProps = {
    impact: 'N/A',
    hasTooltip: false,
    tooltipPosition: 'top',
    tooltipPrefix: '',
    title: '',
    size: 'md'
};

Shield.propTypes = {
    impact: propTypes.oneOfType([
        propTypes.string,
        propTypes.number
    ]),
    hasTooltip: propTypes.bool,
    tooltipPosition: propTypes.string,
    tooltipPrefix: propTypes.string,
    title: propTypes.string,
    size: propTypes.string // sm, md, lg and xl
};

export default Shield;
