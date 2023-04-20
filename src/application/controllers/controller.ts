import { HttpResponse, badRequest, ok, serverError } from "@/application/helpers";
import { ValidationComposite, Validator } from "@/application/validation";

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>;

  buildValidators (_httpRequest: any): Validator[] {
    return [];
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest);
    if (error) return badRequest(error);
    try{
      return this.perform(httpRequest);
    } catch (err) {
      const error = err as Error;
      return serverError(error);
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest);
    return new ValidationComposite(validators).validate();
  }
}
