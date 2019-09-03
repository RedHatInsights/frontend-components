import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { ConditionalFilter } from '../../components/src';

class DemoApp extends Component {
    render() {
        return (
            <ConditionalFilter items={[
            { type: 'custom', filterValues: { children: <div>aaaa</div> }, value: 'custom', label: 'Custom' },
                { type: 'text', label: 'Textual', value: 'textual' },
            ]} />
        );
    }
}

ReactDOM.render(<DemoApp />, document.querySelector('.demo-app'));
