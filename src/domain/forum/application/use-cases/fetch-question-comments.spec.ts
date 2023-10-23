import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch recent questions', () => {
  beforeEach(async () => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question questionComments', async () => {
    inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-id') }),
    );
    inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityId('question-id') }),
    );

    inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('other-question-id'),
      }),
    );

    const { questionComments } = await sut.execute({
      page: 1,
      questionId: 'question-id',
    });

    expect(questionComments).toEqual([
      expect.objectContaining({ questionId: { value: 'question-id' } }),
      expect.objectContaining({ questionId: { value: 'question-id' } }),
    ]);
  });
  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityId('question-id') }),
      );
    }

    const { questionComments } = await sut.execute({
      page: 2,
      questionId: 'question-id',
    });

    expect(questionComments).toHaveLength(2);
  });
});
