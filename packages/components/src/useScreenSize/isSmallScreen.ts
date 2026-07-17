import breakpoints from './breakpoints';

const isSmallScreen = (screenSize: keyof typeof breakpoints) => breakpoints?.[screenSize] <= breakpoints.sm;

export default isSmallScreen;
