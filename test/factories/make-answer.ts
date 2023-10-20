import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer';

export function makeAnswer(override: Partial<AnswerProps>) {
  const answer = Answer.create({
    content: faker.lorem.text(),
    authorId: new UniqueEntityId(),
    questionId: new UniqueEntityId(),
    ...override,
  });

  return answer;
}
