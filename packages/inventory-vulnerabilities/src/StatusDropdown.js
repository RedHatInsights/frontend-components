import { Button, FormSelect, FormSelectOption, Modal, Stack, StackItem } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeSystemCveStatusAction, fetchSystemCveStatusList } from './redux/actions';

const notifications = {
    success: {
        variant: 'success',
        title: 'Status change done!'
    }
};

class StatusDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            statusId: 0
        };
    }

    componentDidMount() {
        this.setState({ statusId: this.props.currentStatusId });
    }

    onChange = value => {
        this.setState({ statusId: parseInt(value) });
    };

    handleModalToggle = () => {
        this.setState(({ isModalOpen }) => ({
            isModalOpen: !isModalOpen
        }));
    };

    createNotification(type) {
        return this.props.hasNotification && this.props.addNotification(notifications[type]);
    }

    render() {
        const { systemId, currentStatusName, cveName, statusList } = this.props;
        const isLoaded = statusList && !statusList.isLoading;
        const dropdownItems = isLoaded && (
            <FormSelect value={ this.state.statusId } onChange={ this.onChange } id="change-status">
                { statusList.payload.data.map(item => (
                    <FormSelectOption key={ item.id } value={ item.id } label={ item.name } />
                )) }
            </FormSelect>
        );
        const actionButtons = this.state.isModalOpen && [
            <Button key="cancel" variant="secondary" onClick={ this.handleModalToggle }>
                Cancel
            </Button>,
            isLoaded && (
                <Button
                    key="confirm"
                    variant="primary"
                    onClick={ () => {
                        this.props
                        .changeStatus(systemId, cveName, this.state.statusId, StatusDropdown.updateRef)
                        .then(() => this.createNotification('success'));
                        this.handleModalToggle();
                    } }
                >
                    Confirm
                </Button>
            )
        ];
        const modal = this.state.isModalOpen && (
            <Modal
                isSmall={ true }
                title="Update the status for this CVE and system"
                isOpen={ this.state.isModalOpen }
                onClose={ this.handleModalToggle }
                actions={ actionButtons }
            >
                <Stack>
                    <StackItem>Status</StackItem>
                    <StackItem>{ (isLoaded && dropdownItems) || <Skeleton size={ SkeletonSize.lg } /> }</StackItem>
                </Stack>
            </Modal>
        );
        return (
            <React.Fragment>
                <div
                    className="status-dropdown-column"
                    onClick={ () => {
                        this.handleModalToggle();
                        this.props.fetchStatusList();
                    } }
                >
                    { currentStatusName } <PencilAltIcon size="sm" />
                </div>
                { modal }
            </React.Fragment>
        );
    }
}

function mapStateToProps({ VulnerabilitiesStore }) {
    return {
        statusList: VulnerabilitiesStore && VulnerabilitiesStore.statusList
    };
}

const mapDispatchToProps = dispatch => {
    return {
        fetchStatusList: () => dispatch(fetchSystemCveStatusList()),
        addNotification: data => dispatch(addNotification(data)),
        changeStatus: (inventoryId, cve, statusId, callback) => dispatch(changeSystemCveStatusAction(inventoryId, cve, statusId, callback))
    };
};

StatusDropdown.updateRef = () => {};

StatusDropdown.setCallback = updateFunc => {
    StatusDropdown.updateRef = updateFunc;
};

StatusDropdown.propTypes = {
    fetchStatusList: propTypes.func,
    hasNotification: propTypes.bool,
    addNotification: propTypes.func,
    systemId: propTypes.string,
    currentStatusId: propTypes.number,
    currentStatusName: propTypes.string,
    cveName: propTypes.string,
    statusList: propTypes.object,
    changeStatus: propTypes.func
};

StatusDropdown.defaultProps = {
    hasNotification: false
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StatusDropdown);
