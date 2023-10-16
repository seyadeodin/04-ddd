import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { Question } from '../../enterprise/entities/question';
import { Slug } from '../../enterprise/entities/value-objects/slug';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get question by slug', () => {
  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
    // system under test
  });

  it('should be able to get a question by slug', async () => {
    const newQuestion = Question.create({
      title: 'Example question',
      slug: Slug.create('example-question'),
      content: 'Content',
      authorId: new UniqueEntityId(),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const { question } = await sut.execute({
      slug: 'example-question',
    });

    expect(question.title).toEqual('Example question');
  });
});
