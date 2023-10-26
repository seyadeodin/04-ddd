import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { EditAnswerUseCase } from './edit-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { NotAllowedError } from './errors/not-allowed-error';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit answer', () => {
  beforeEach(async () => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
    // system under test
  });

  it('should be able to edit a answer by id', async () => {
    const answer = makeAnswer({});

    inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'New content',
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'New content',
    });
  });

  it('should not be able to edit a answer from another user', async () => {
    const answer = makeAnswer({});

    inMemoryAnswersRepository.create(answer);
    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'different-author-id',
      content: 'New content',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
