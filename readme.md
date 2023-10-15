# DDD (Design-driven Design)

## Fundamentals
- DDD is methodology for software development
- Allow us to relate our real life problems into domain language
- Domain language has little to do with code
- Design: Has nothing to do with how it will be implemented but how we can convert our client problem into something palpable

### What is a domain
- Are of understanding where everyone involved in the software development has a similar knowledge

#### Important concepts
- Domain experts
    - People that deeply understand the problem we are solving with our software
    - A developer usually is NOT a domain expert but those who deal daily with the problems our software is tring to solve
    - Conversation is very important to create a ubiquitous lanugage
- Ubiquitous language
    - An unversal langauge where everyone involved in the software development can communicate
    - For a domain expert what for us can be only one entity can be broken down into different nomeoclatures
- Agregates
- Value Objects
- Domain Events
- Subdomains
- Entities
- Use-cases

## Entities and use use-cases
- We must think of our software as totally disconnected from external layers
- Example of possible topics a domain expert can bring up:
    - Dificulty in knowing  wht the **students** **doubts** actually are.
    - When answering students **I** have difficulty figuring out what doubts have already been **answered**.
- Here we can identify the **entities** and use-cases of our application.
- With these identified we can start implement it using OOO.

### Creating our first entitiesa
- Softwares are living organism: the first version we create of what we're developing hardly will become the final version, they are usually constructed with the limited knowledge we have at that point.


#### Creating generic classes
- On [./src/core/entities/entity.ts]
    - We create a generic class Entity which will be extend by all our entity classes.
    - Here we have the id, which is present in all our entities, and receive the other props from our classes.
    - We also add a getter to give access to our id.
```tsx
import { UniqueEntityId } from "./unique-entity-id"

export class Entity<T> {
  private _id: UniqueEntityId
  protected props: T

  get id() {
    return this._id
  }

  protected constructor(props: any, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId(id)
  }
}

```
- On [./src/core/entities/unique-entity-id.ts.ts]
    -  We also have a separate class for our uuid which either attribute a random uuid value or set the one passed to us.
    - Instead of getters we create the methods .toString() and .toValue()
    ```tsx
    import { randomUUID } from "crypto"

    export class UniqueEntityId {
      private value: string

      toString() {
        return this.value
      }

      toValue() {
        return this.value
      }

      constructor(value?: string) {
        this.value = value ?? randomUUID()
      }
    }

    ```

### Creating a entity class
- On [./src/domain/entities/answer]
    - Here is an example of one of our most complete classes.
    - Instead of creating setters for all our values we add them as the need for use them arises.
    - With getteres we can create new object properties, excpert for example returns a small part of our content.
    - Our setters can also have additoinal logic, our title change for example changes both title and slug and refresh our updatedAt date.
    - As the end instead of a constructor we have a custom `static` create method which includes the logic of some of the methods which won't be set by the users.
    ```tsx
    import { Slug } from "./value-objects/slug"
    import { Entity } from "@/core/entities/entity"
    import { UniqueEntityId } from "@/core/entities/unique-entity-id"
    import { Optional } from "@/core/types/optional"
    import  dayjs  from 'dayjs'

    interface QuestionProps {
      authorId: UniqueEntityId
      bestAnswerId?: UniqueEntityId
      title: string 
      content: string 
      slug: Slug
      createdAt: Date
      updatedAt?: Date
    }

    export class Question extends Entity<QuestionProps> {
      get authorId() {
        return this.props.authorId
      }

      get questionId() {
        return this.props.bestAnswerId
      }

      get title() {
        return this.props.title
      }

      get content() {
        return this.props.content
      }

      get createdAt() {
        return this.props.createdAt
      }

      get updatedAt() {
        return this.props.updatedAt
      }

      get isNew(): boolean {
        return dayjs().diff(this.createdAt, 'days') <= 3

      }

      get exercpt() {
        return this.content.substring(0, 120).trimEnd().concat('...')
      }

      private touch() {
        this.props.updatedAt = new Date()
      }

      set title(title: string) {
        this.props.title = title
        this.props.slug = Slug.createFromText(title)

        this.touch()
      }

      set content(content: string) {
        this.props.content = content
        this.touch()
      }

      set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
        this.props.bestAnswerId = bestAnswerId
        this.touch()
      }


      static create(props: Optional<QuestionProps, 'createdAt' | 'slug'>, id?: UniqueEntityId) {
        const question = new Question({
          ...props,
          slug: props.slug ?? Slug.createFromText(props.title),
          createdAt: new Date(),
        }, id)

        return question
      }
    }

    ```

### TS hacks 
- In [./src/core/types/optional.ts]
    - Here we have a custom typescript type that allow us to turn some of the properties of our types optional. This line of code defines a TypeScript type called `Optional`. Here's an explanation of each part:
        - `export type`: This indicates that we are exporting a type declaration that can be used in other modules.
        - `Optional<T, K extends keyof T>`: This is the name and signature of the type. It takes two generic type parameters: `T` and `K`. `T` represents the type of the object we want to make optional, and `K` represents the keys of `T` that we want to make optional.
        - `Pick<Partial<T>, K>`: This part uses the `Pick` utility type to create a new type that includes only the specified keys `K` from the `Partial<T>` type. `Partial<T>` makes all properties of `T` optional.
        - `&`: This is the intersection type operator. It combines two types into a new type that includes all properties from both types.
        - `Omit<T, K>`: This uses the `Omit` utility type to create a new type that excludes the specified keys `K` from the `T` type. It removes the keys we made optional in the previous step.
    - Above we have a special type commentary that servers as a kind of documentation for our code, explaining what it does and giving an example, which will appear when we hover over it.
    ```tsx
    /**
     * Make some property optional on type
     *
     * @example
     * ```typescript
     * type Post {
     *  id: string;
     *  name: string;
     *  email: string;
     * }
     *
     * Optional<Post, 'id' | 'email'>
     * ```
     **/

    export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

    ```
### Value Objects
- On [./src/domain/entities/value-objects/slug.ts]
    - Value objects are properties from our classes that have a logic complex to create another class over it.
    - Here we have one to create a slug, which will be used to create the url for our question.
    - We have a logic to normalize the text removing spaces, accents and usuing lowercase.
    - Above our static methods we also have a documentation-like commentary.
    ```tsx
    export class Slug {
      public value: string

      constructor(value: string) {
        this.value = value
      }
      /**
      * Receives a string and normalize it as a slug
      *
      * Example: "An example title" => "an-example-title"
      *
      * @param text(string)
      */
      static createFromText(text: string) {
        const slugText = text
          .normalize('NFKD')
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/_/g, '-')
          .replace(/--+/g, '-')
          .replace(/-$/g, '')

        return new Slug(slugText)
      }
    }

    ```
### Use-case
- On [./src/domain/use-cases/answer-question.ts]:
    - We have our first use case which in answering a question.
    - For that we instantiate our class and return it.
   ```tsx
    import { UniqueEntityId } from "@/core/entities/unique-entity-id"
    import { Answer } from "../entities/answer"
    import { AnswersRepository } from "../repositories/answers-repository"

    interface AnswerQuestionUseCaseRequest {
      instructorId: string
      questionId: string
      content: string
    }

    export class AnswerQuestionUseCase {
      constructor(private answersRepository: AnswersRepository) {}

      async execute({ instructorId, questionId, content}: AnswerQuestionUseCaseRequest) {
        const answer = Answer.create({
          content,
          authorId: new UniqueEntityId(instructorId), 
          questionId: new UniqueEntityId(questionId)
        })

        await this.answersRepository.create(answer)

        return answer
      }
    }

   ```
## Forum with DDD and clean architecture
