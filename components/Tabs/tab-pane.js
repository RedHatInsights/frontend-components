import React from 'react';

const createReactClass = require('create-react-class');

const TabPane = createReactClass({
    displayName: 'Tab-Pane',
    render () {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
});

export default TabPane;