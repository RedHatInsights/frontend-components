import React from 'react';
import merge from 'lodash/merge';
import mapKeys from 'lodash/mapKeys';
import ContentLoader from 'react-content-loader';
import { Tooltip } from '@patternfly/react-core';

export const CSV_TYPE = 'text/csv;charset=utf-8;';
export const JSON_TYPE = 'data:text/json;charset=utf-8,';

export function mergeArraysByKey(arrays, key = 'id') {
    let mergedObject = merge(...arrays.map(row => mapKeys(row, a => a && a[key])));
    return Object.values(mergedObject);
}

export function downloadFile(data, filename = `${new Date().toISOString()}`, format = CSV_TYPE) {
    const type = format === 'json' ? JSON_TYPE : CSV_TYPE;
    const blob = new Blob([ data ], { type });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `${filename}.${format}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function parseCvssScore(cvssV2, cvssV3, withLabels = false) {
    const v2Tooltip = 'Prior to 2016 (approximately), CVEs were scored with Common Vulnerability Scoring System v2.';
    const naTooltip = 'CVEs published before 2005 (approximately) did not have a CVSS Base Score.';
    return (
        (cvssV3 && parseFloat(cvssV3).toFixed(1)) ||
        (cvssV2 && (
            <Tooltip content={ v2Tooltip } position={ 'left' }>
                <span>{ `${parseFloat(cvssV2).toFixed(1)}` } {withLabels && '(CVSSv2)'}</span>
            </Tooltip>
        )) || (
            <Tooltip content={ naTooltip } position={ 'left' }>
                <span>N/A</span>
            </Tooltip>
        )
    );
}

export function processDate(dateString) {
    const date = new Date(dateString);
    const dateFormat = require('dateformat');
    return (date instanceof Date && !isNaN(date) && dateFormat(date, 'dd mmm yyyy')) || 'N/A';
}

export const RowLoader = props => (
    <ContentLoader height={ 20 } width={ 480 } { ...props }>
        <rect x="30" y="0" rx="3" ry="3" width="250" height="7" />
        <rect x="300" y="0" rx="3" ry="3" width="70" height="7" />
        <rect x="385" y="0" rx="3" ry="3" width="95" height="7" />
        <rect x="50" y="12" rx="3" ry="3" width="80" height="7" />
        <rect x="150" y="12" rx="3" ry="3" width="200" height="7" />
        <rect x="360" y="12" rx="3" ry="3" width="120" height="7" />
        <rect x="0" y="0" rx="0" ry="0" width="20" height="20" />
    </ContentLoader>
);
