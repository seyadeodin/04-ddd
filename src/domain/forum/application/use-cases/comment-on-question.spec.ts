import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { makeQuestion } from 'test/factories/make-question';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on question', () => {
  beforeEach(async () => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionCommentsRepository,
      inMemoryQuestionsRepository,
    );
  });

  it('should be able to comment on question', async () => {
    const question = makeQuestion({});
    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      authorId: '1',
      questionId: question.id.toString(),
      content: 'Comentário teste',
    });

    if (result.isLeft()) {
      expect(1).toBe(2);
      return;
    }

    expect(inMemoryQuestionCommentsRepository.items[0]);
    expect(result.isRight()).toBe(true);
    expect(result.value.questionComment.id).toBeInstanceOf(UniqueEntityId);
    expect(result.value.questionComment.content).toEqual('Comentário teste');
  });
});
