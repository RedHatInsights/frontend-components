/* eslint-disable camelcase */
import { ToolbarGroup } from '@patternfly/react-core';
import { TableToolbar } from '@redhat-cloud-services/frontend-components';
import propTypes from 'prop-types';
import React, { Component } from 'react';
import DownloadReportKebab from './Components/DownloadReportKebab';
import Filters from './Components/Filters';
import PaginationWrapper from './Components/PaginationWrapper';
import Remediation from './Components/Remediation';
import SelectAllCheckbox from './Components/SelectAllCheckbox';
import { CVETableContext } from './VulnerabilitiesCves';

class CveToolbarWithContext extends Component {
    render() {
        const { showAllCheckbox, showRemediationButton, entity, context } = this.props;
        const { cves, params, methods } = context;
        const { selectedCves } = params;
        const selectedCvesCount = this.props.showRemediationButton === true ? (selectedCves && selectedCves.size) || 0 : undefined;
        return (
            <TableToolbar className="space-between-toolbar-items">
                <ToolbarGroup className="vulnerability-toolbar-spacing">
                    { showRemediationButton && (
                        <SelectAllCheckbox
                            selectedItems={ selectedCvesCount }
                            selectorHandler={ methods.selectCves }
                            cves={ cves }
                            fetchResource={ ops => methods.fetchResource({ ...params, ...ops }) }
                        />
                    ) }
                    <Filters apply={ methods.apply } showStatusList={ Boolean(entity) } showAllCheckbox={ showAllCheckbox } filterValues={ params } />
                    { showRemediationButton && <Remediation systemId={ entity.id } selectedCves={ selectedCves } /> }
                    <DownloadReportKebab downloadReport={ methods.downloadReport } />
                </ToolbarGroup>

                <ToolbarGroup>
                    <PaginationWrapper apply={ methods.apply } meta={ cves.meta } />
                </ToolbarGroup>
            </TableToolbar>
        );
    }
}

CveToolbarWithContext.propTypes = {
    showAllCheckbox: propTypes.bool,
    showRemediationButton: propTypes.bool,
    totalNumber: propTypes.number,
    entity: propTypes.object,
    location: propTypes.object,
    context: propTypes.object
};

CveToolbarWithContext.defaultProps = {
    showAllCheckbox: false,
    showRemediationButton: false,
    totalNumber: 0,
    apply: () => undefined,
    downloadReport: () => undefined
};

const VulnerabilitiesCveTableToolbar = props => (
    <CVETableContext.Consumer>{ context => <CveToolbarWithContext context={ context } { ...props } /> }</CVETableContext.Consumer>
);
export default VulnerabilitiesCveTableToolbar;
