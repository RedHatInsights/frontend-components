import React, { Component } from 'react';
import { RouteComponentProps as RouteProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import asyncComponent from '../../Utilities/asyncComponent';
import './sample-page.scss';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component<RouteProps<any> & Props, State> {
    render() {}
}

export default SamplePage;
