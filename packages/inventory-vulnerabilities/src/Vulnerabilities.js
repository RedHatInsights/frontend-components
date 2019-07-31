import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { classNames, sortable } from '@patternfly/react-table';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createCveListBySystem } from './DataMapper';
import { fetchCveListBySystem } from './redux/actions';
import './vulnerabilities.scss';
import VulnerabilitiesCves from './VulnerabilitiesCves';

const cvssBaseDescription = 'All CVEs use Common Vulnerability Scoring System v3 except where noted.';

const header = [
    { title: 'Name', key: 'synopsis', transforms: [ sortable, classNames('col-width-10') ], columnTransforms: [ classNames('no-wrap') ]},
    {
        title: 'Description',
        key: 'description',
        transforms: [ classNames('col-width-description') ],
        columnTransforms: [ classNames('hide-description') ]
    },
    {
        title: 'Publish date',
        key: 'public_date',
        transforms: [ sortable, classNames('col-width-10') ]
    },
    {
        title: 'CVSS base ',
        key: 'cvss_score',
        transforms: [ sortable, classNames('col-width-10') ]
    },
    { title: 'Impact', key: 'impact', transforms: [ sortable, classNames('col-width-10') ], columnTransforms: [ classNames('no-wrap') ]},
    { title: 'Status', key: 'status', transforms: [ sortable, classNames('col-width-15') ]}
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
