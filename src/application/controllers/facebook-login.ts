import { FacebookAuthentication } from "@/domain/features";
import { HttpResponse, badRequest, ok, serverError, unauthorized } from "@/application/helpers";
import { AccessToken } from "@/domain/model";
import { RequiredStringValidator, ValidationComposite } from "../validation";

type HttpRequest = {
  token: string;
}

type Model = Error | {
  accessToken: string;
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try{
      const error = this.validate(httpRequest);

      if (error) {
        return badRequest(error)
      }

      const accessToken = await this.facebookAuthentication.execute({ token: httpRequest.token });

      if (accessToken instanceof AccessToken) {
        return ok({
          accessToken: accessToken.value
        })
      } else {
        return unauthorized()
      }
    } catch (err) {
      const error = err as Error;
      return serverError(error);
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    return new ValidationComposite([
      new RequiredStringValidator(httpRequest.token, 'token')
    ]).validate();
  }
}
