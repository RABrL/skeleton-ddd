import { faker } from "@faker-js/faker";

export class EmailMother {
  static random() {
    return faker.internet.email();
  }
}
