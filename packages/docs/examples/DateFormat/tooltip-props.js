import React from 'react';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { Title } from '@patternfly/react-core';

const DifferentDateDataTypes = () => {
    const date = new Date();
    const tooltipProps = {
        position: 'left',
        distance: 80
    };
    return (
        <div>
            <Title size="lg" headingLevel="h3">
                Tooltip shows on the left size and is further from the root element.
            </Title>
            <span>Adding tooltip props: &nbsp;</span><DateFormat tooltipProps={tooltipProps} date={date} />< br />
        </div>
    );
};

export  default DifferentDateDataTypes;
