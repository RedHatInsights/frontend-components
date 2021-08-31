import breakpoints from './breakpoints';

const isSmallScreen = screenSize => breakpoints?.[screenSize] <= breakpoints.sm;

export default isSmallScreen;
