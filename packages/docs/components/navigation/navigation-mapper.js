import ChromeNavigation from './chrome-navigation';
import ComponentsNavigation from './components-navigation';

const navigationMapper = {
  fec: ComponentsNavigation,
  chrome: ChromeNavigation,
};

export default navigationMapper;
