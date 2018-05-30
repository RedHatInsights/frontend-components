import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import asyncComponent from '../src/Utilities/asyncComponent';
import { Button } from 'patternfly-react';
import './App.scss';

/**
 * Allows for type checking.
 * https://reactjs.org/docs/typechecking-with-proptypes.html
 */
type Props = {};
type State = {};

class App extends Component<Props, State> {
    render() {
        return (
          <Routes childProps={this.props} />
        );
    }
}

