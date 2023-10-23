import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswerComment } from 'test/factories/make-answer-comment';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete answer comment', () => {
  beforeEach(async () => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
    // system under test
  });

  it('should be able to delete a answer comment by id', async () => {
    const answerComment = makeAnswerComment({});

    inMemoryAnswerCommentsRepository.create(answerComment);

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a answerComment from another user', async () => {
    const answerComment = makeAnswerComment({});

    inMemoryAnswerCommentsRepository.create(answerComment);

    await expect(
      async () =>
        await sut.execute({
          answerCommentId: answerComment.id.toString(),
          authorId: 'different-author-id',
        }),
    ).rejects.toBeInstanceOf(Error);
  });
});
