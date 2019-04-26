import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCveListBySystem } from '../../../../redux/actions/applications';
import VulnerabilitiesCves from './VulnerabilitiesCves';
import { Card, CardBody, Tooltip, TextContent, TextVariants, Text } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { createCveListBySystem } from './DataMapper';
import { sortable, cellWidth } from '@patternfly/react-table';
import './vulnerabilities.scss';

const cvssBaseDescription = 'All CVEs use Common Vulnerability Scoring System v3 except where noted.';

const header = [
    { title: 'Name', key: 'synopsis', transforms: [ sortable, cellWidth(10) ]},
    { title: 'Description', key: 'description', transforms: [ cellWidth(45) ]},
    { title: 'Publish date', key: 'public_date', transforms: [ sortable, cellWidth(10) ]},
    {
        title: 'CVSS base ',
        key: 'cvss_score',
        transforms: [ sortable, cellWidth(10) ]
    },
    { title: 'Severity', key: 'impact', transforms: [ sortable, cellWidth(10) ]},
    { title: 'Status', key: 'status', transforms: [ sortable ]}
];

class VulnerabilitiesDetail extends Component {
    render() {
        const { entity } = this.props;
        return (
            <React.Fragment>
                <TextContent>
                    <Text component={ TextVariants.h2 }>CVEs</Text>
                </TextContent>
                <VulnerabilitiesCves
                    header={ header }
                    fetchResource={ params => fetchCveListBySystem({ ...params, system: entity.id }) }
                    dataMapper={ params => createCveListBySystem({ ...params, systemId: entity.id }) }
                    showAllCheckbox={ false }
                    showRemediationButton={ true }
                    defaultSort="-public_date"
                    entity={ entity }
                    isSelectable={ true }
                />
            </React.Fragment>
        );
    }
}

VulnerabilitiesDetail.propTypes = {
    entity: PropTypes.shape({})
};

VulnerabilitiesDetail.defaultProps = {
    entity: {}
};

function mapStateToProps({ entityDetails: { entity }}) {
    return {
        entity
    };
}

export default connect(
    mapStateToProps,
    null
)(VulnerabilitiesDetail);
