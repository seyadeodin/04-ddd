import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { DeleteQuestionUseCase } from './delete-question';
import { makeQuestion } from 'test/factories/make-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete question', () => {
  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
    // system under test
  });

  it('should be able to delete a question by id', async () => {
    const question = makeQuestion({});

    inMemoryQuestionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
    });

    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from another user', async () => {
    const question = makeQuestion({});

    inMemoryQuestionsRepository.create(question);

    await expect(
      async () =>
        await sut.execute({
          questionId: question.id.toString(),
          authorId: 'different-author-id',
        }),
    ).rejects.toBeInstanceOf(Error);
  });
});
