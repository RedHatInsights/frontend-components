import React from 'react';
import PropTypes from 'prop-types';
import { ShieldAltIcon, DollarSignIcon, WrenchIcon, CertificateIcon } from '@patternfly/react-icons';

const HealthToIcon = {
    cost: {
        component: <DollarSignIcon />,
        redirect: 'cost_management'
    },
    configuration: {
        component: <WrenchIcon />,
        redirect: 'configuration_assessment'
    },
    compliance: {
        component: <CertificateIcon />,
        redirect: 'compliance'
    },
    vulnerabilities: {
        component: <ShieldAltIcon />,
        redirect: 'vulnerabilities'
    }
};

class HealthStatus extends React.Component {
    constructor(props) {
        super(props);
    }

    onStatusClicked(event, clickedOn, health) {
        event.stopPropagation();
        this.props.onHealthClicked && this.props.onHealthClicked(event, clickedOn, health);
    }

    render() {
        const { items, className } = this.props;
        return (
            <div className={ className }>
                { items && Object.keys(items).map(oneKey => (
                    <div key={ oneKey } onClick={ (event) => this.onStatusClicked(event, items[oneKey], HealthToIcon[oneKey]) }>
                        <span>{ HealthToIcon[oneKey].component }</span>
                        <span>{ items[oneKey].title }</span>
                    </div>
                )) }
            </div>
        );
    }
}

HealthStatus.propTypes = {
    className: PropTypes.string,
    items: PropTypes.any,
    onHealthClicked: PropTypes.func
};

export default HealthStatus;
