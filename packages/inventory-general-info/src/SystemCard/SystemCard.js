import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from '../LoadingCard';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { propertiesSelector } from '../selectors';
import { editDisplayName, editAnsibleHost, systemProfile } from '../redux/actions';
import TextInputModal from '../TextInputModal';
import { loadEntity } from '@redhat-cloud-services/frontend-components-inventory/redux';
import { Popover, Button } from '@patternfly/react-core';
import EditButton from '../EditButton';
import { generalMapper } from '../dataMapper';
import { extraShape } from '../constants';

const TitleWithPopover = ({ title, content }) => (
    <React.Fragment>
        <span>{ title }</span>
        <Popover
            headerContent={<div>{ title }</div>}
            bodyContent={<div>{ content }</div>}>
            <Button
                variant="plain"
                aria-label={`Action for ${title}`}
                className='ins-active-general_information__popover-icon'>
                <OutlinedQuestionCircleIcon />
            </Button>
        </Popover>
    </React.Fragment>
);

class SystemCard extends Component {
    state = {
        isDisplayNameModalOpen: false,
        isAnsibleHostModalOpen: false
    };

    onCancel = () => {
        this.setState({
            isDisplayNameModalOpen: false,
            isAnsibleHostModalOpen: false
        });
    };

    onSubmit = (fn) => (value) => {
        const { entity } = this.props;
        fn(entity.id, value);
        this.onCancel();
    }

    onShowDisplayModal = (event) => {
        event.preventDefault();
        this.setState({
            isDisplayNameModalOpen: true
        });
    };

    onShowAnsibleModal = (event) => {
        event.preventDefault();
        this.setState({
            isAnsibleHostModalOpen: true
        });
    };

    getAnsibleHost = () => {
        const { entity } = this.props;
        return entity.ansible_host || entity.fqdn || entity.id;
    };

    render() {
        const {
            detailLoaded,
            entity,
            properties,
            setDisplayName,
            setAnsibleHost,
            writePermissions,
            handleClick,
            hasHostName,
            hasDisplayName,
            hasAnsibleHostname,
            hasSAP,
            hasCPUs,
            hasSockets,
            hasCores,
            hasCPUFlags,
            hasRAM,
            extra
        } = this.props;
        const { isDisplayNameModalOpen, isAnsibleHostModalOpen } = this.state;
        return (
            <Fragment>
                <LoadingCard
                    title="System properties"
                    isLoading={ !detailLoaded }
                    items={ [
                        ...hasHostName ? [{
                            title: <TitleWithPopover
                                title='Host name'
                                content='Name imported from the system.'/>,
                            value: entity.fqdn, size: 'md'
                        }] : [],
                        ...hasDisplayName ? [{
                            title: <TitleWithPopover
                                title='Display name'
                                content='System name displayed in an inventory list.'/>,
                            value: (
                                <Fragment>
                                    { entity.display_name }
                                    <EditButton writePermissions={writePermissions} link="display_name" onClick={this.onShowDisplayModal} />
                                </Fragment>
                            ), size: 'md'
                        }] : [],
                        ...hasAnsibleHostname ? [{
                            title: <TitleWithPopover
                                title='Ansible hostname'
                                content='Hostname that is used in playbooks by Remediations.'/>,
                            value: (
                                <Fragment>
                                    { this.getAnsibleHost() }
                                    <EditButton writePermissions={writePermissions} link="ansible_name" onClick={this.onShowAnsibleModal} />
                                </Fragment>
                            ), size: 'md'
                        }] : [],
                        ...hasSAP ? [{
                            title: 'SAP',
                            value: properties.sapIds?.length,
                            singular: 'identifier',
                            target: 'sap_sids',
                            onClick: () => {
                                handleClick(
                                    'SAP IDs (SID)',
                                    generalMapper(properties.sapIds, 'SID')
                                );
                            }
                        }] : [],
                        ...hasCPUs ? [{ title: 'Number of CPUs', value: properties.cpuNumber }] : [],
                        ...hasSockets ? [{ title: 'Sockets', value: properties.sockets }] : [],
                        ...hasCores ? [{ title: 'Cores per socket', value: properties.coresPerSocket }] : [],
                        ...hasCPUFlags ? [{
                            title: 'CPU flags',
                            value: properties?.cpuFlags?.length,
                            singular: 'flag',
                            target: 'flag',
                            onClick: () => handleClick('CPU flags', generalMapper(properties.cpuFlags, 'flag name'))
                        }] : [],
                        ...hasRAM ? [{ title: 'RAM', value: properties.ramSize }] : [],
                        ...extra.map(({ onClick, ...item }) => ({
                            ...item,
                            ...onClick && {
                                onClick: () => {
                                    handleClick(...onClick() || []);
                                }
                            }
                        }))
                    ] }
                />
                <TextInputModal
                    isOpen={ isDisplayNameModalOpen }
                    title='Edit display name'
                    value={ entity && entity.display_name }
                    ariaLabel='Host inventory display name'
                    onCancel={ this.onCancel }
                    onSubmit={ this.onSubmit(setDisplayName) }
                />
                <TextInputModal
                    isOpen={ isAnsibleHostModalOpen }
                    title='Edit Ansible host'
                    value={ entity && this.getAnsibleHost() }
                    ariaLabel='Ansible host'
                    onCancel={ this.onCancel }
                    onSubmit={ this.onSubmit(setAnsibleHost) }
                />
            </Fragment>
        );
    }
}

SystemCard.propTypes = {
    detailLoaded: PropTypes.bool,
    entity: PropTypes.shape({
        // eslint-disable-next-line camelcase
        display_name: PropTypes.string,
        // eslint-disable-next-line camelcase
        ansible_host: PropTypes.string,
        fqdn: PropTypes.string,
        id: PropTypes.string
    }),
    properties: PropTypes.shape({
        cpuNumber: PropTypes.number,
        sockets: PropTypes.number,
        coresPerSocket: PropTypes.number,
        ramSize: PropTypes.string,
        storage: PropTypes.arrayOf(PropTypes.shape({
            device: PropTypes.string,
            // eslint-disable-next-line camelcase
            mount_point: PropTypes.string,
            options: PropTypes.shape({}),
            type: PropTypes.string
        })),
        sapIds: PropTypes.arrayOf(PropTypes.string)
    }),
    setDisplayName: PropTypes.func,
    setAnsibleHost: PropTypes.func,
    writePermissions: PropTypes.bool,
    handleClick: PropTypes.func,
    hasHostName: PropTypes.bool,
    hasDisplayName: PropTypes.bool,
    hasAnsibleHostname: PropTypes.bool,
    hasSAP: PropTypes.bool,
    hasCPUs: PropTypes.bool,
    hasSockets: PropTypes.bool,
    hasCores: PropTypes.bool,
    hasCPUFlags: PropTypes.bool,
    hasRAM: PropTypes.bool,
    extra: PropTypes.arrayOf(extraShape)
};
SystemCard.defaultProps = {
    detailLoaded: false,
    entity: {},
    properties: {},
    hasHostName: true,
    hasDisplayName: true,
    hasAnsibleHostname: true,
    hasSAP: true,
    hasCPUs: true,
    hasSockets: true,
    hasCores: true,
    hasCPUFlags: true,
    hasRAM: true,
    extra: []
};

TitleWithPopover.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
};

function mapDispatchToProps(dispatch) {
    const reloadWrapper = (id, event) => {
        event.payload.then(data => {
            dispatch(systemProfile(id, { hasItems: true }));
            dispatch(loadEntity(id, { hasItems: true }, { showTags: true }));
            return data;
        });

        return event;
    };

    return {
        setDisplayName: (id, value) => {
            dispatch(reloadWrapper(id, editDisplayName(id, value)));
        },

        setAnsibleHost: (id, value) => {
            dispatch(reloadWrapper(id, editAnsibleHost(id, value)));
        }
    };
}

export default connect(({
    entityDetails: {
        entity
    },
    systemProfileStore: {
        systemProfile
    }
}) => ({
    entity,
    detailLoaded: systemProfile && systemProfile.loaded,
    properties: propertiesSelector(systemProfile, entity)
}), mapDispatchToProps)(SystemCard);
