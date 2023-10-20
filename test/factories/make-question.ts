import { faker } from '@faker-js/faker';
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export function makeQuestion(override: Partial<QuestionProps>) {
  const title = override.title ?? faker.lorem.sentence();
  const question = Question.create({
    title,
    slug: Slug.createFromText(title),
    content: faker.lorem.text(),
    authorId: new UniqueEntityId(),
    ...override,
  });

  return question;
}
