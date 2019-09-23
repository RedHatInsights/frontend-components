import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './tagCount.scss';
import TagModal from '../TagModal/TagModal'

export default class TagCount extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
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
                <span>{this.props.count}</span>
                <TagModal modalOpen={this.state.modalOpen} />
            </div>
        )
    }
}