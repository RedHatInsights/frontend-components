import breakpoints from './breakpoints';

const variants = Object.keys(breakpoints);

const isSmallScreen = screenSize => variants.indexOf(screenSize) <= variants.indexOf('sm');

export default isSmallScreen;
