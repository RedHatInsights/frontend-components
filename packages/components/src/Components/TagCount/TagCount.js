import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './tagCount.scss';

export default class TagCount extends React.Component
{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="ins-c-tagCount">
                <i className="fas fa-tag"></i>
                <p>{this.props.count}</p>
            </div>
        )
    }
}