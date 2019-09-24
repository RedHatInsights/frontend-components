import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './tagCount.scss';
import TagModal from '../TagModal/TagModal'

export default class TagCount extends React.Component
{
    constructor(props) {
        super(props);
        let count = 0;
        if (props.systemName === 'paul.localhost.com') {
            count = 11;
        } else {
            count = 2; 
        }
        this.state = {
            modalOpen: false,
            count: count
        };
    }

    toggleTagModal = () => {
        this.setState(({ modalOpen }) => ({
            modalOpen: !modalOpen
          }));
    }

    render() {
        return (
            <div className="ins-c-tagCount" onClick={this.toggleTagModal}>
                <i className="fas fa-tag"></i>
                <span>{this.state.count}</span>
                <TagModal modalOpen={this.state.modalOpen} systemName={this.props.systemName} />
            </div>
        )
    }
}