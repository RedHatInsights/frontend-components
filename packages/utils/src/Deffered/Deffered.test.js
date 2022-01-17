import Defered from './Deffered';

it('should create object', () => {
  const def = new Defered();
  expect(def).toMatchObject({
    promise: expect.any(Promise),
    resolve: expect.any(Function),
    reject: expect.any(Function),
  });
});
