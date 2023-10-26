import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { makeAnswer } from 'test/factories/make-answer';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on answer', () => {
  beforeEach(async () => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerCommentsRepository,
      inMemoryAnswersRepository,
    );
    // system under test
  });

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer({});
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      authorId: '1',
      answerId: answer.id.toString(),
      content: 'Comentário teste',
    });

    if (result.isLeft()) {
      expect(1).toBe(2);
      return;
    }

    expect(inMemoryAnswerCommentsRepository.items[0]);
    expect(result.isRight()).toBe(true);
    expect(result.value.answerComment.id).toBeInstanceOf(UniqueEntityId);
    expect(result.value.answerComment.content).toEqual('Comentário teste');
  });
});
