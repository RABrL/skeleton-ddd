import { faker } from "@faker-js/faker";

export class IntegerMother {
  static random(max?: number) {
    return faker.number.int(max);
  }
}
