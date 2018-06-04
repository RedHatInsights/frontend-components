import React from 'react';
import ReactCreateClass from 'create-react-class';

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