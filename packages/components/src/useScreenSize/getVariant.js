import breakpoints from './breakpoints';

const getVariant = () => {
    const width = window.innerWidth;

    let result;

    Object.entries(breakpoints).some(([ variant, size ]) => {
        if (width > size) {
            result = variant;
        } else {
            return true;
        }
    });

    return result;
};

export default getVariant;
