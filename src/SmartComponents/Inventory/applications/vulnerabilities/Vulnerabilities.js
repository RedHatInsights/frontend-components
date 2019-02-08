import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCveListBySystem } from '../../../../redux/actions/applications';
import VulnerabilitiesCves from './VulnerabilitiesCves';
import { Card, CardBody } from '@patternfly/react-core';
import { createCveListBySystem } from './DataMapper';
import './vulnerabilities.scss';

const header = [
    { title: 'Impact', key: 'impact', width: 5 },
    { title: 'Name', key: 'synopsis', width: 10 },
    { title: 'Description', key: 'description', width: 60, hasSort: false },
    { title: 'CVSS Base Score', key: 'cvss_score', width: 5 },
    { title: 'Publish date', key: 'public_date', width: 10 }
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
