export const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error
    || (typeof validator === 'function'
        ? validator(value)
        : undefined),
    undefined);
