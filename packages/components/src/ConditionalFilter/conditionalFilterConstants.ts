import { Fragment } from 'react';
import Text from './TextFilter';
import Checkbox from './CheckboxFilter';
import Radio from './RadioFilter';
import Group from './GroupFilter';

export const conditionalFilterType = {
  text: 'text',
  checkbox: 'checkbox',
  radio: 'radio',
  custom: 'custom',
  group: 'group',
};

export const typeMapper = {
  text: Text,
  checkbox: Checkbox,
  radio: Radio,
  custom: Fragment,
  group: Group,
};
