import { conditionalFilterType, typeMapper } from './constants';
import Checkbox from './Checkbox';
import Text from './Text';

it('should have correct types', () => {
    expect(Object.values(conditionalFilterType).length).toBe(3);
});

it('should return correct type', () => {
    expect(typeMapper('checkbox')).toBe(Checkbox);
});

it('should return Text if no type present', () => {
    expect(typeMapper('error')).toBe(Text);
});
