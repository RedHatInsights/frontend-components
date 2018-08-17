import React, { Component } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class ConnectedBreadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.onNavigate = this.onNavigate.bind(this);
    this.calculateBreadcrumbs = this.calculateBreadcrumbs.bind(this);
  }

  onNavigate(_event, _item, key) {
    const { history } = this.props;
    history.go(-key);
  }

  calculateBreadcrumbs() {
    const { match, location, current, mappings } = this.props;
    if (!current && mappings) {
      const root = match.path.split('/').slice(2);
      const rest = location.pathname.substring(match.path.length).split('/').slice(1);
      return [
        ...root,
        ...rest.map((item, key) => mappings[key] || item)
      ];
    } else {
      return [
        ...location.pathname.split('/').slice(2, -1),
        current
      ]
    }
  }

  render() {
    const {match, location, history, current, staticContext, dispatch, ...props} = this.props;
    const mappedBreadcrumbs = this.calculateBreadcrumbs() || [];
    return (
      <Breadcrumbs {...props}
        items={mappedBreadcrumbs.slice(0, -1).map(item => ({title: item, navigate: item}))}
        onNavigate={this.onNavigate}
        current={mappedBreadcrumbs.slice(-1)[0]}
      />
    )
  }
}

export default withRouter(ConnectedBreadcrumbs);