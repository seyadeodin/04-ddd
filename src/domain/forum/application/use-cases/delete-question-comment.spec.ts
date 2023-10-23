import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { makeQuestionComment } from 'test/factories/make-question-comment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete question comment', () => {
  beforeEach(async () => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
    // system under test
  });

  it('should be able to delete a question comment by id', async () => {
    const questionComment = makeQuestionComment({});

    inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a questionComment from another user', async () => {
    const questionComment = makeQuestionComment({});

    inMemoryQuestionCommentsRepository.create(questionComment);

    await expect(
      async () =>
        await sut.execute({
          questionCommentId: questionComment.id.toString(),
          authorId: 'different-author-id',
        }),
    ).rejects.toBeInstanceOf(Error);
  });
});
