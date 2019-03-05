import React from 'react';
import { Shield } from '../../../../PresentationalComponents/Shield';
import { LongTextTooltip } from '../../../../PresentationalComponents/LongTextTooltip';
import { parseCvssScore, processDate } from '../../../../Utilities/helpers';
import { Link } from 'react-router-dom';
import StatusDropdown from './StatusDropdown';

export function createCveListBySystem({ isLoading, systemId, ...rest }) {
    if (!isLoading) {
        const {
            payload: { data, meta }
        } = rest;
        return {
            data: data.map(row => ({
                id: row.id,
                cells: [
                    <Shield
                        impact={ row.attributes.impact }
                        hasTooltip={ true }
                        tooltipPosition={ 'right' }
                        key={ row.id.toString() }
                    />,
                    <span key={ row.id }>{ handleCVELink(row.attributes.synopsis) }</span>,
                    <LongTextTooltip
                        content={ row.attributes.description }
                        tooltipMaxWidth={ '50vw' }
                        entryDelay="1200"
                        key={ row.id.toString() }
                    />,
                    parseCvssScore(row.attributes.cvss2_score, row.attributes.cvss3_score),
                    <span key={ row.attributes.synopsis }>
                        <StatusDropdown
                            currentStatusName={ row.attributes.status }
                            systemId={ systemId }
                            currentStatusId={ row.attributes.status_id }
                            cveName={ row.attributes.synopsis }
                        />
                    </span>,
                    processDate(row.attributes.public_date)
                ]
            })),
            meta,
            isLoading
        };
    }

    return { data: [], meta: (rest.payload && rest.payload.meta) || {}, isLoading };
}

function handleCVELink(synopsis) {

    if (location.href.indexOf('vulnerability') !== -1) {
        return <Link to={ '/cves/' + synopsis }>{ synopsis }</Link>;
    } else {
        return <a href={ `${document.baseURI}platform/vulnerability/cves/${synopsis}` }>{ synopsis }</a>;
    }
}
