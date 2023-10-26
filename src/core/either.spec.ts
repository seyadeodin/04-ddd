import { Either, Left, Right, left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10);
  } else {
    return left('error');
  }
}

test('sucess result', () => {
  const success = doSomething(true);

  expect(success.isRight()).toBe(true);
  expect(success.value).toEqual(10);
});
