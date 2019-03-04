import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCveListBySystem } from '../../../../redux/actions/applications';
import VulnerabilitiesCves from './VulnerabilitiesCves';
import { Card, CardBody, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { createCveListBySystem } from './DataMapper';
import { sortable, cellWidth } from '@patternfly/react-table';
import './vulnerabilities.scss';

const cvssBaseDescription = 'All CVEs use Common Vulnerability Scoring System v3 except where noted.';

const header = [
    { title: '', key: 'impact', transforms: [ sortable, cellWidth(10) ]},
    { title: 'Name', key: 'synopsis', transforms: [ sortable, cellWidth(10) ]},
    { title: 'Description', key: 'description', transforms: [ cellWidth('max') ]},
    {
        title: (
            <React.Fragment>
                <Tooltip
                    position="top"
                    content={ <div>{ cvssBaseDescription }</div> }
                >
                    <InfoCircleIcon className={ 'table-header-icon' } arial-label={ cvssBaseDescription } aria-hidden="false" />
                </Tooltip>
                { 'CVSS Base ' }
            </React.Fragment>
        ),
        key: 'cvss_score',
        transforms: [ sortable, cellWidth(10) ]
    },
    { title: 'Publish Date', key: 'public_date', transforms: [ sortable, cellWidth(10) ]}
];

class VulnerabilitiesDetail extends Component {
    render() {
        const { entity } = this.props;
        return (
            <Card>
                <CardBody>
                    <VulnerabilitiesCves
                        header={ header }
                        fetchResource={ params => fetchCveListBySystem({ ...params, system: entity.id }) }
                        dataMapper={ createCveListBySystem }
                        showAllCheckbox={ false }
                        showRemediationButton={ true }
                        defaultSort='-public_date'
                        entity={ entity }
                    />
                </CardBody>
            </Card>
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

;

export default connect(
    mapStateToProps,
    null
)(VulnerabilitiesDetail);
