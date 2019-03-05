import { Button, FormSelect, FormSelectOption, Modal, Stack, StackItem } from '@patternfly/react-core';
import { EditIcon } from '@patternfly/react-icons';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeSystemCveStatus } from '../../../../api/vulnerabilities';
import { LongTextTooltip } from '../../../../PresentationalComponents/LongTextTooltip';
import { Skeleton, SkeletonSize } from '../../../../PresentationalComponents/Skeleton';
import { fetchSystemCveStatusList } from '../../../../redux/actions/applications';
import { addNotification } from '../../../Notifications';
import propTypes from 'prop-types';

const notifications = {
    processing: {
        variant: 'info',
        title: 'Status change is processing'
    },
    success: {
        variant: 'success',
        title: 'Status change done!'
    },
    fail: {
        variant: 'danger',
        title: 'Status change failed!'
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
        this.setState({ statusId: value });
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
                { statusList.payload.map(item => (
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
                        this.createNotification('processing');
                        changeSystemCveStatus(systemId, cveName, this.state.statusId, StatusDropdown.updateRef)
                        .then(() => this.createNotification('success'))
                        .catch(() => {
                            this.createNotification('fail');
                        });
                        this.handleModalToggle();
                    } }
                >
                    Confirm
                </Button>
            )
        ];
        const modal = this.state.isModalOpen && (
            <Modal
                isLarge={ true }
                title="Update the status for this CVE and system"
                isOpen={ this.state.isModalOpen }
                onClose={ this.handleModalToggle }
                actions={ actionButtons }
            >
                <Stack>
                    <StackItem>Status:</StackItem>
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
                    <LongTextTooltip content={ currentStatusName } maxLength={ 25 } />
                    <EditIcon />
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
        addNotification: data => dispatch(addNotification(data))
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
    statusList: propTypes.array
};

StatusDropdown.defaultProps = {
    hasNotification: false
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StatusDropdown);
