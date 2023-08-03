import { Fragment } from 'react';
import Text, { TextFilterProps } from './TextFilter';
import Checkbox, { CheckboxFilterProps } from './CheckboxFilter';
import Radio, { RadioFilterProps } from './RadioFilter';
import Group, { GroupFilterProps } from './GroupFilter';

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

export function identifyComponent<T extends TextFilterProps | CheckboxFilterProps | RadioFilterProps | GroupFilterProps | Record<string, any>>(
  type: keyof typeof conditionalFilterType,
  props: T
): props is T {
  return true;
}
