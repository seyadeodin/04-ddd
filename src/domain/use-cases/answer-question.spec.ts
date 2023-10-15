import { AnswerQuestionUseCase } from './answer-question';
import { Answer } from '../entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    console.log(answer);
  },
};

describe('Answer question', () => {
  it('should be able to create an answer', async () => {
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

    const answer = await answerQuestion.execute({
      questionId: '1',
      instructorId: '1',
      content: 'Nova Resposta',
    });

    expect(answer.content).toEqual('Nova Resposta');
  });
});
