import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { makeAnswerComment } from 'test/factories/make-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments', () => {
  beforeEach(async () => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch answer comments', async () => {
    inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }),
    );
    inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }),
    );

    inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('other-answer-id'),
      }),
    );

    const { answerComments } = await sut.execute({
      page: 1,
      answerId: 'answer-id',
    });

    expect(answerComments).toEqual([
      expect.objectContaining({ answerId: { value: 'answer-id' } }),
      expect.objectContaining({ answerId: { value: 'answer-id' } }),
    ]);
  });
  it('should be able to fetch paginated answers comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityId('answer-id') }),
      );
    }

    const { answerComments } = await sut.execute({
      page: 2,
      answerId: 'answer-id',
    });

    expect(answerComments).toHaveLength(2);
  });
});
