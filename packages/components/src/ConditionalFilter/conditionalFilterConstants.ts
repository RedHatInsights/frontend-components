import { Fragment } from 'react';
import Text, { TextFilterProps } from './TextFilter';
import Checkbox, { CheckboxFilterProps } from './CheckboxFilter';
import Radio, { RadioFilterProps } from './RadioFilter';
import Group, { GroupFilterProps } from './GroupFilter';
import SingleSelectFilter, { SingleSelectFilterProps } from './SingleSelectFilter';

export const conditionalFilterType = {
  text: 'text',
  checkbox: 'checkbox',
  radio: 'radio',
  custom: 'custom',
  group: 'group',
  singleSelect: 'singleSelect',
};

export const typeMapper = {
  text: Text,
  checkbox: Checkbox,
  radio: Radio,
  custom: Fragment,
  group: Group,
  singleSelect: SingleSelectFilter,
};

export function identifyComponent<
  T extends TextFilterProps | CheckboxFilterProps | RadioFilterProps | GroupFilterProps | SingleSelectFilterProps | Record<string, any>
>(type: keyof typeof conditionalFilterType, props: T): props is T {
  return true;
}
