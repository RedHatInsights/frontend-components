import React from 'react';
import propTypes from 'prop-types';

import classNames from 'classnames';

import './ansible.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */

const Ansible = ({ unsupported, className, ...props }) => {

    let ansibleLogoClass = classNames(
        className,
        'Ansible',
        { [`is-supported`]: !unsupported || unsupported === 0 },
        { [`is-unsupported`]: unsupported || unsupported === 1 }
    );

    let unsupportedSlash;
    let ariaLabels = {};
    if (unsupported) {
        unsupportedSlash =
        <React.Fragment>
            <rect
                x="1245.1"
                y="272.4"
                transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 3082.5815 -510.474)"
                className="st0"
                width="803.8"
                height="221.5"/>

            <rect
                x="-279.7"
                y="904"
                transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 2450.9683 1014.3757)"
                className="st1"
                width="2590.2"
                height="221.5"/>

            <rect
                x="17.1"
                y="1620.5"
                transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 1734.4641 2744.1697)"
                className="st0"
                width="563.7"
                height="221.5"/>
        </React.Fragment>;
        ariaLabels = {
            ['disabled']: 'disabled',
            ['aria-label']: 'Does not have Ansible support'
        };
    } else {
        ariaLabels = { ['aria-label']: 'Has Ansible support' };
    }

    ;

    return (
        <i className={ ansibleLogoClass } { ...ariaLabels } { ...props } widget-type='InsightsAnsibleSupport'>
            <svg version="1.1" id="Layer_1" x="0px" y="0px"
                viewBox="0 0 2032 2027.2" style={ { enableBackground: 'new 0 0 2032 2027.2' } }>
                <path className="st0" d="M2030.8,1014.8c0,559.2-453.3,1012.4-1012.4,1012.4C459.2,2027.2,5.9,1574,5.9,1014.8
                    C5.9,455.7,459.2,2.4,1018.3,2.4C1577.5,2.4,2030.8,455.7,2030.8,1014.8 M1035.4,620.9l262,646.6L901.7,955.8L1035.4,620.9
                    L1035.4,620.9z M1500.8,1416.5l-403-969.9c-11.5-28-34.5-42.8-62.4-42.8c-28,0-52.7,14.8-64.2,42.8L528.9,1510.4h151.3l175.1-438.6
                    l522.5,422.1c21,17,36.2,24.7,55.9,24.7c39.5,0,74-29.6,74-72.3C1507.7,1439.4,1505.3,1428.3,1500.8,1416.5L1500.8,1416.5z"/>
                { unsupportedSlash }
            </svg>
        </i>
    );
};

export default Ansible;

Ansible.propTypes = {
    /**
     * Description that will generate MD docs file
     */
    unsupported: propTypes.oneOfType([
        propTypes.bool,
        propTypes.number
    ]),
    className: propTypes.string
};
