import { HttpResponse, ok, unauthorized } from "@/application/helpers";
import { ValidationBuilder, Validator } from "../validation";
import { Controller } from "@/application/controllers";
import { FacebookAuthentication } from "@/domain/use-cases";

type HttpRequest = { token: string };
type Model = Error | { accessToken: string };

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuthentication({ token: httpRequest.token });
      return ok(accessToken)
    } catch {
      return unauthorized();
    }
  }

  override buildValidators(httpRequest: any): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build(),
    ]
  }
}
