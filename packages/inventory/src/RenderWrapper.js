import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

class RenderWrapper extends PureComponent {
    ref = createRef();

    renderApp = () => {
        const { cmp: Component, inventoryRef, store, ...props } = this.props;
        if (this.ref.current) {
            ReactDOM.render(
                <Provider store={store}>
                    <Component
                        {...props}
                        { ...inventoryRef && {
                            ref: inventoryRef
                        }}
                        store={ store }
                    />
                </Provider>,
                this.ref.current
            );
        }
    }

    componentDidMount() {
        this.renderApp();
    }

    componentWillUnmount() {
        if (this.ref.current) {
            ReactDOM.unmountComponentAtNode(this.ref.current);
        }
    }

    componentDidUpdate({ appName }) {
        if (appName !== this.props.appName) {
            if (this.ref.current) {
                ReactDOM.unmountComponentAtNode(this.ref.current);
            }

            this.renderApp();
        }
    }

    render() {
        return <article ref={ this.ref }/>;
    }
}

RenderWrapper.propTypes = {
    cmp: PropTypes.any,
    inventoryRef: PropTypes.any,
    store: PropTypes.object,
    customRender: PropTypes.bool
};

export default RenderWrapper;
