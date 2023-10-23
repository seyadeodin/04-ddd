import { faker } from '@faker-js/faker';
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export function makeAnswerComment(override: Partial<AnswerCommentProps>) {
  const answerComment = AnswerComment.create({
    answerId: new UniqueEntityId(),
    authorId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override,
  });

  return answerComment;
}
