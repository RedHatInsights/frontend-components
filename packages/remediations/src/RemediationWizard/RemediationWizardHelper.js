import React, { Component } from 'react';
import BaseRemediationWizard from './RemediationWizard';

class RemediationWizard extends Component {

    state = {
        isOpen: false
    }

    openWizard = (data, basePath) => {
        this.setState({
            isOpen: true,
            data: {
                ...data,
                issues: [{
                    description: 'Bonding will not fail over to the backup link when bonding options are partially read',
                    id: 'advisor:network_bond_opts_config_issue|NETWORK_BONDING_OPTS_DOUBLE_QUOTES_ISSUE',
                    systems: [ '702502d2-1b72-472a-8b1c-bacfdd2ee8a4' ]
                }, {
                    description: 'Cluster nodes are frequently fenced as realtime is not enabled in corosync',
                    id: 'advisor:corosync_enable_rt_schedule|COROSYNC_NOT_ENABLE_RT',
                    systems: [ '335e6733-bab8-4696-8a0b-ff329eed4aea', 'da627f06-2a15-48b0-b5d9-55173e12a97d' ]
                }, {
                    description: 'Kernel vulnerable to local privilege escalation via DCCP module (CVE-2017-6074)',
                    id: 'advisor:CVE_2017_6074_kernel|KERNEL_CVE_2017_6074',
                    systems: [ '5f8b7586-bb74-4bf7-be15-1f258eb9e79d',
                        '95fd611b-9d23-4713-b2f7-e577fde97d82',
                        '702502d2-1b72-472a-8b1c-bacfdd2ee8a4' ]
                }],
                systems: data.systems || []
            },
            basePath
        });
    }

    setOpen = (value) => {
        this.setState({ isOpen: value });
    }

    render () {
        return (
            this.state.isOpen
                ? <BaseRemediationWizard
                    data={this.state.data}
                    basePath={this.state.basePath}
                    setOpen={this.setOpen}/>
                : null
        );
    }
}

export default RemediationWizard;
