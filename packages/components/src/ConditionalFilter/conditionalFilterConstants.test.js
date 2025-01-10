import { conditionalFilterType, typeMapper } from './conditionalFilterConstants';

it('should have correct types', () => {
  expect(Object.values(conditionalFilterType).length).toBe(6);
});

it('should return correct type', () => {
  expect(typeMapper.checkbox.name).toBe('CheckboxFilter');
});
