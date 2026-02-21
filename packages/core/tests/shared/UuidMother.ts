import { faker } from "@faker-js/faker";

export class UuidMother {
  static random() {
    return faker.string.uuid();
  }
}
