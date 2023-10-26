import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch recent questions', () => {
  beforeEach(async () => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it('should be able to fetch question answers', async () => {
    inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-id') }),
    );
    inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('question-id') }),
    );
    inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityId('other-question-id') }),
    );

    const result = await sut.execute({
      page: 1,
      questionId: 'question-id',
    });

    if (result.isLeft()) {
      expect(1).toBe(2);
      return;
    }

    expect(result.isRight()).toEqual(true);
    expect(result.value.answers).toEqual([
      expect.objectContaining({ questionId: { value: 'question-id' } }),
      expect.objectContaining({ questionId: { value: 'question-id' } }),
    ]);
  });
  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityId('question-id') }),
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-id',
    });

    if (result.isLeft()) {
      expect(1).toBe(2);
      return;
    }

    expect(result.value.answers).toHaveLength(2);
  });
});
