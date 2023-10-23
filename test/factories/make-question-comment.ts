import { faker } from '@faker-js/faker';
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export function makeQuestionComment(override: Partial<QuestionCommentProps>) {
  const questionComment = QuestionComment.create({
    questionId: new UniqueEntityId(),
    authorId: new UniqueEntityId(),
    content: faker.lorem.text(),
    ...override,
  });

  return questionComment;
}
