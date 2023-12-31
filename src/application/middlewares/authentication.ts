import { HttpResponse, forbidden, ok } from "@/application/helpers";
import { RequiredStringValidator } from "@/application/validation";
import { Authorize } from "@/domain/use-cases";
import { Middleware } from "@/application/middlewares";

type HttpRequest = {
  authorization: string;
}

type Model = Error | { userId: string }

export class AuthenticationMiddleware implements Middleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      if (!this.validate({ authorization })) return forbidden()
      const userId = await this.authorize({ token: authorization })
      return ok({
        userId,
      })
    } catch {
      return forbidden()
    }
  }

  private validate({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
