import { RequiredFieldError } from "../erros";

export class RequiredStringValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string,
  ) {}

  validate (): Error | undefined {
    if (!this.value)
      return new RequiredFieldError(this.fieldName);

    return undefined
  }
}
