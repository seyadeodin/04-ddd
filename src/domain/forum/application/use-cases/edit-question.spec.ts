import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { EditQuestionUseCase } from './edit-question';
import { makeQuestion } from 'test/factories/make-question';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit question', () => {
  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to edit a question by id', async () => {
    const question = makeQuestion({});

    inMemoryQuestionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'New content',
      title: 'New title',
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: 'New content',
      title: 'New title',
    });
  });

  it('should not be able to edit a question from another user', async () => {
    const question = makeQuestion({});

    inMemoryQuestionsRepository.create(question);

    await expect(
      async () =>
        await sut.execute({
          questionId: question.id.toString(),
          authorId: 'different-author-id',
          content: 'New content',
          title: 'New title',
        }),
    ).rejects.toBeInstanceOf(Error);
  });
});
