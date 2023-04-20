import { FacebookAuthentication } from "@/domain/features";
import { HttpResponse, ok, unauthorized } from "@/application/helpers";
import { AccessToken } from "@/domain/model";
import { ValidationBuilder, Validator } from "../validation";
import { Controller } from "@/application/controllers";

type HttpRequest = {
  token: string;
}

type Model = Error | {
  accessToken: string;
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.execute({ token: httpRequest.token });
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized();
  }

  override buildValidators(httpRequest: any): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build(),
    ]
  }
}
