import { required, minLength } from '../../Validators/validators';

describe('Form validators', () => {
  describe('required validator', () => {
    it('should pass the validation', () => {
      expect(required('foo')).toBeUndefined();
    });

    it('should return default error message', () => {
      expect(required(undefined)).toEqual('Required');
    });

    it('should return custom error message', () => {
      expect(required({ message: 'Foo' })(undefined)).toEqual('Foo');
    });
  });

  describe('min length validator', () => {
    it('should pass the validation', () => {
      expect(minLength(5)('Some longer text')).toBeUndefined();
    })

    it('should return default error message', () => {
      expect(minLength(99)('Foo')).toEqual('Should be atleast 99 long');
    });
  });
});