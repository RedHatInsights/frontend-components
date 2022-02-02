import ChromeNavigation from './chrome-navigation';
import ComponentsNavigation from './components-navigation';
import UIOnboardingNavigation from './ui-onboarding-navigation';

const navigationMapper = {
  fec: ComponentsNavigation,
  chrome: ChromeNavigation,
  'ui-onboarding': UIOnboardingNavigation,
};

export default navigationMapper;
