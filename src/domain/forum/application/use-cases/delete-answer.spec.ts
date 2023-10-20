import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { makeAnswer } from 'test/factories/make-answer';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe('Delete answer', () => {
  beforeEach(async () => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
    // system under test
  });

  it('should be able to delete a answer by id', async () => {
    const answer = makeAnswer({});

    inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a answer from another user', async () => {
    const answer = makeAnswer({});

    inMemoryAnswersRepository.create(answer);

    await expect(
      async () =>
        await sut.execute({
          answerId: answer.id.toString(),
          authorId: 'different-author-id',
        }),
    ).rejects.toBeInstanceOf(Error);
  });
});
