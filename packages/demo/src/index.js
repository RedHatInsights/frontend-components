import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

class DemoApp extends Component {
    render() {
        return (
            <div>I am demo!</div>
        )
    }
}

ReactDOM.render(<DemoApp />, document.querySelector('.demo-app'));