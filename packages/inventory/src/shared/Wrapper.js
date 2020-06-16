import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { InventoryContext } from './constants';

class RenderWrapper extends Component {
    ref = createRef();

    componentDidMount() {
        const { cmp: Component, inventoryRef, store, ...props } = this.props;
        if (this.ref.current) {
            ReactDOM.render(
                store ?
                    <Provider store={store}>
                        <Component
                            {...props}
                            inventoryRef
                            { ...inventoryRef && {
                                ref: inventoryRef
                            }}
                            store={ store }
                        />
                    </Provider> :
                    <Component
                        {...props}
                        { ...inventoryRef && {
                            ref: inventoryRef
                        }}
                        store={ store }
                    />,
                this.ref.current
            );
        }
    }

    componentWillUnmount() {
        if (this.ref.current) {
            ReactDOM.unmountComponentAtNode(this.ref.current);
        }
    }

    render() {
        return <InventoryContext.Provider value={this.props}>
            <article ref={ this.ref }/>
        </InventoryContext.Provider>;
    }
}

RenderWrapper.propTypes = {
    cmp: PropTypes.oneOfType([ PropTypes.func, PropTypes.string, PropTypes.element ]),
    inventoryRef: PropTypes.any,
    store: PropTypes.object,
    customRender: PropTypes.bool
};

export default RenderWrapper;
