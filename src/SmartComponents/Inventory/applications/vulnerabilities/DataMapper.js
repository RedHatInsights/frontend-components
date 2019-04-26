import React from 'react';
import { Shield } from '../../../../PresentationalComponents/Shield';
import { LongTextTooltip } from '../../../../PresentationalComponents/LongTextTooltip';
import { parseCvssScore, processDate } from '../../../../Utilities/helpers';
import { Link } from 'react-router-dom';
import StatusDropdown from './StatusDropdown';

export function createCveListBySystem({ isLoading, systemId, ...rest }) {
    if (!isLoading) {
        const {
            payload: { data, meta, errors }
        } = rest;
        return {
            data: data && [
                ...data.map(row => ({
                    id: row.id,
                    cells: [
                        <span key={ row.id }>{ handleCVELink(row.attributes.synopsis) }</span>,
                        <span key={ row.id }>
                            <LongTextTooltip content={ row.attributes.description } tooltipMaxWidth={ '50vw' } entryDelay={ 1200 }
                                maxLength={ 180 } />
                        </span>,

                        <span key={ row.id }>{ processDate(row.attributes.public_date) }</span>,
                        <span key={ row.id }>{ parseCvssScore(row.attributes.cvss2_score, row.attributes.cvss3_score, true) }</span>,
                        <span key={ row.id }>
                            <Shield impact={ row.attributes.impact } tooltipPosition={ 'right' } hasLabel={ true } />
                        </span>,

                        <span key={ row.attributes.synopsis }>
                            <StatusDropdown
                                currentStatusName={ row.attributes.status }
                                systemId={ systemId }
                                currentStatusId={ row.attributes.status_id }
                                cveName={ row.attributes.synopsis }
                                hasNotification={ true }
                            />
                        </span>
                    ]
                }))
            ],
            meta,
            errors,
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
