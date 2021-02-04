import React, { useEffect } from 'react';
import { FormGroup, Switch, Stack, StackItem } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/dist/esm/use-field-api';

const SwitchGroup = (props) => {
    const { label, input, options } = useFieldApi(props);

    const handleChange = (checked, value) => checked
        ? input.onChange([ ...input.value, value ])
        : input.onChange(input.value.filter(x => x !== value));

    useEffect(() => {
        if (!input.value) {
            input.onChange(options.map(({ value }) => value).filter(Boolean));
        }
    }, []);

    return (
        <FormGroup
            label={ label }
            fieldId={ input.name }
        >
            <Stack hasGutter>
                {
                    options.map((option => (
                        option.value && <StackItem key={option.value}>
                            <Switch
                                label={option.label}
                                onChange={(checked) => handleChange(checked, option.value)}
                                isChecked={input.value.includes(option.value)}
                                id={option.value}
                            />
                            <div className="pf-c-switch pf-u-mt-sm">
                                <span className="pf-c-switch__toggle ins-c-sources__wizard--hide-me" />
                                <div className="pf-c-switch__label ins-c-sources__wizard--switch-description">
                                    {option.description}
                                </div>
                            </div>
                        </StackItem>
                    )))
                }
            </Stack>
        </FormGroup>
    );
};

export default SwitchGroup;
