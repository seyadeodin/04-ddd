import { AnswerQuestionUseCase } from './answer-question';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

let answersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe('Answer question', () => {
  beforeEach(async () => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  it('should be able to create an answer', async () => {
    const { answer } = await sut.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Nova Resposta',
    });

    expect(answer.content).toEqual('Nova Resposta');
    expect(answersRepository.items[0].id).toEqual(answer.id);
  });
});
