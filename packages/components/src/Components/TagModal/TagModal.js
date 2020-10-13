import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import './tagModal.scss';
import {
    Modal,
    Button,
    Tabs,
    Tab,
    TabTitleText,
    TabContent
} from '@patternfly/react-core';
import classNames from 'classnames';
import TableWithFilter from './TableWithFilter';

const calculateChecked = (rows = [], selected) => (
    rows.every(({ id }) => selected && selected.find(({ id: selectedId }) => selectedId === id))
        ? rows.length > 0
        : rows.some(({ id }) => selected && selected.find(({ id: selectedId }) => selectedId === id)) && null
);

const unique = (arr) => (
    arr.filter(({ id }, index, arr) => arr.findIndex(({ id: currId }) => currId === id) === index)
);

class TagModal extends Component {
    contentRefs = [];
    state = {
        selectedTab: 0
    };

    componentDidMount() {
        const { tabNames } = this.props;
        if (Array.isArray(tabNames)) {
            tabNames.forEach((_item, key) => {
                this.contentRefs[key] = createRef();
            });
        }
    }

    handleTabClick = (_event, tabIndex) => {
        this.setState({ activeTabKey: tabIndex });
    };

    renderTable = (rows, columns, pagination, loaded, filters) => (
        <TableWithFilter
            rows={rows}
            pagination={pagination}
            loaded={loaded}
            calculateChecked={calculateChecked}
            unique={unique}
            filters={filters}
            title={this.props.title}
            systemName={this.props.systemName}
            columns={columns}
            {...this.props}
        >
            {this.props.children}
        </TableWithFilter>
    );

    render() {
        const {
            className,
            title,
            systemName,
            toggleModal,
            isOpen,
            rows,
            columns,
            children,
            pagination,
            loaded,
            filters,
            onApply,
            tabNames,
            ...props
        } = this.props;

        return (
            <Modal
                {...props}
                className={classNames('ins-c-tag-modal', className)}
                isOpen={isOpen}
                title={title || `Tags for ${systemName}`}
                onClose={(e) => toggleModal(e, false)}
                variant="medium"
                {...onApply && {
                    actions: [
                        <Button key="confirm" variant="primary" onClick={(e) => {
                            onApply();
                            toggleModal(e, true);
                        }}>
                            Apply tags
                        </Button>,
                        <Button key="cancel" variant="link" onClick={(e) => toggleModal(e, false)}>
                            Cancel
                        </Button>
                    ]
                }}
            >
                {Array.isArray(tabNames) ?
                    <Fragment>
                        <Tabs activeKey={this.state.activeTabKey} onSelect={this.handleTabClick}>
                            {
                                tabNames.map((item, key) => (
                                    <Tab
                                        key={key}
                                        eventKey={key}
                                        title={<TabTitleText>All {item}</TabTitleText>}
                                        tabContentId={`refTab${key}Section`}
                                        tabContentRef={this.contentRefs[key]}
                                    />
                                ))
                            }
                        </Tabs>
                        <div>
                            {
                                tabNames.map((item, key) => (
                                    <TabContent
                                        key={key}
                                        eventKey={key}
                                        id={`refTab${key}Section`}
                                        ref={this.contentRefs[key]}
                                        aria-label={`All ${item}`}
                                    >
                                        {this.renderTable(rows, columns, pagination, loaded, filters)}
                                    </TabContent>
                                ))
                            }
                        </div>
                    </Fragment> :
                    this.renderTable(rows, columns, pagination, loaded, filters)}
            </Modal>
        );
    }
}

TagModal.propTypes = {
    tabNames: PropTypes.string,
    loaded: PropTypes.bool,
    title: PropTypes.string,
    systemName: PropTypes.string,
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
    rows: PropTypes.array,
    columns: PropTypes.array,
    className: PropTypes.string,
    tableProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    }),
    onSelect: PropTypes.func,
    onUpdateData: PropTypes.func,
    pagination: PropTypes.shape({
        count: PropTypes.number,
        page: PropTypes.number,
        perPage: PropTypes.number
    }),
    primaryToolbarProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    }),
    selected: PropTypes.array
};

TagModal.defaultProps = {
    loaded: false,
    isOpen: false,
    toggleModal: () => undefined,
    columns: [
        { title: 'Name' },
        { title: 'Tag source' }
    ],
    onUpdateData: () => undefined,
    rows: [],
    tableProps: {},
    pagination: { count: 10 }
};

export default TagModal;
