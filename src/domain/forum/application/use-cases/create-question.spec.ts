import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create question', () => {
  beforeEach(async () => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
    // system under test
  });

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Título',
      content: 'Nova Pergunta',
    });

    if (result.isLeft()) {
      expect(1).toBe(2);
      return;
    }

    expect(result.isRight()).toBe(true);
    expect(result.value.question.id).toBeInstanceOf(UniqueEntityId);
    expect(result.value.question.content).toEqual('Nova Pergunta');
    expect(result.value.question.title).toEqual('Título');
  });
});
