import { faker } from "@faker-js/faker";

export class WordMother {
  static random({
    minLength = 1,
    maxLength,
  }: {
    minLength?: number;
    maxLength: number;
  }) {
    return (
      faker.lorem.word(
        Math.floor(Math.random() * (maxLength - minLength)) + minLength,
      ) || "word"
    );
  }
}
