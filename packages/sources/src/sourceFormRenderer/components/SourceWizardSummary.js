import React from 'react';
import PropTypes from 'prop-types';
import { TextContent, TextListItem, TextListItemVariants, TextListVariants, TextList } from '@patternfly/react-core';

const SourceWizardSummary = ({ sourceTypes, formOptions, applicationTypes }) => {
    const values = formOptions.getState().values;
    const type = sourceTypes.find(type => type.name === values.source_type);
    const fields = type.schema.fields;
    const application = applicationTypes.find(type => type.id === values.app_type);
    const applicationName = application ? application.display_name : 'Not selected';

    const valuesList = Object.keys(values).map((key) => {
        const formField = fields.find((field) => field.name === key);
        let value = values[key];

        // not in field, probably source_name or type, handled seperately
        if (!formField) {
            return undefined;
        }

        // do not show hidden fields
        if (formField.type === 'hidden') {
            return undefined;
        }

        // Boolean value convert to Yes / No
        if (typeof values[key] === 'boolean') {
            value = values[key] ? 'Yes' : 'No';
        }

        return (
            <React.Fragment key={ key }>
                <TextListItem component={ TextListItemVariants.dt }>{ formField.label }</TextListItem>
                <TextListItem component={ TextListItemVariants.dd }>{ value }</TextListItem>
            </React.Fragment>
        );
    });

    return (<TextContent>
        <TextList component={ TextListVariants.dl }>
            <TextListItem component={ TextListItemVariants.dt }>{ 'Name' }</TextListItem>
            <TextListItem component={ TextListItemVariants.dd }>{ values.source_name }</TextListItem>
            <TextListItem component={ TextListItemVariants.dt }>{ 'Source Type' }</TextListItem>
            <TextListItem component={ TextListItemVariants.dd }>{ type.product_name }</TextListItem>
            { valuesList }
            <TextListItem component={ TextListItemVariants.dt }>{ 'Application' }</TextListItem>
            <TextListItem component={ TextListItemVariants.dd }>{ applicationName }</TextListItem>
        </TextList>
    </TextContent>);
};

SourceWizardSummary.propTypes = {
    formOptions: PropTypes.any.isRequired,
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired, //eslint-disable-line camelcase
        schema: PropTypes.shape({
            title: PropTypes.string.isRequired
        })
    })).isRequired,
    applicationTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired //eslint-disable-line camelcase
    })).isRequired
};

export default SourceWizardSummary;
