export type DomainErrorPrimitives = {
  type: string;
  description: string;
  data: Record<string, unknown>;
};

export abstract class DomainError extends Error {
  abstract readonly type: string;

  toPrimitives(): DomainErrorPrimitives {
    const props = Object.entries(this).filter(
      ([key, _]) => key !== "type" && key !== "message",
    );

    return {
      type: this.type,
      description: this.message,
      data: props.reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, unknown>,
      ),
    };
  }
}

export class InvalidArgumentError extends DomainError {
  readonly type = "InvalidArgumentError";
}
