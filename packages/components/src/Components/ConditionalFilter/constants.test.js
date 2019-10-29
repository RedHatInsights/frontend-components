import { conditionalFilterType, typeMapper } from './constants';
import Text from './Text';

it('should have correct types', () => {
    expect(Object.values(conditionalFilterType).length).toBe(5);
});

it('should return correct type', () => {
    expect(typeMapper('checkbox').name).toBe('checkbox');
});

it('should return Text if no type present', () => {
    expect(typeMapper('error')).toBe(Text);
});
