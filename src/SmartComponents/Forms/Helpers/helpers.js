export const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error
    || (typeof validator === 'function'
        ? validator(value)
        : undefined),
    undefined);

const splitter = value => value.split(':').pop();
const excludedOptions = {
    'ui:widget': true,
    'ui:options': true
};

const parseOptionKey = key => ({
    disabled: 'isDisabled',
    readonly: 'isReadOnly'
})[key];

export const optionsMapper = options => Object.keys(options)
.filter(option => !excludedOptions[option])
.reduce((acc, curr) => ({ ...acc, [parseOptionKey(splitter(curr))]: options[curr] }), {});

export const componentArrayMapper = ({ items, ...rest }) => {
    if (Array.isArray(items)) {
        return 'arrayList';
    }

    if (items.enum) {
        return 'choiceList';
    }

    return 'itemList';
};
