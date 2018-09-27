import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';

import { generateID } from '../../functions/generateID.js';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
export default class SampleComponent extends React.Component {
    render () {
        return (
            <span
                className='sample-component'
                widget-type='InsightsSampleComponent'
                widget-id={ generateID('SampleComponent') }>
                { this.props.children }
            </span>
        );
    }
}

SampleComponent.propTypes = {
    children: PropTypes.node
};
