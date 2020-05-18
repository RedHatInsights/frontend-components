import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Unavailable } from '../../components/src/Components/Unavailable';

class MyCmp extends Component {
    render() {
        return (
            <Unavailable/>
        );
    }
}

ReactDOM.render(<MyCmp />, document.querySelector('.demo-app'));
