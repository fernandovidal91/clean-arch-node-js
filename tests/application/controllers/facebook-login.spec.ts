import { FacebookLoginController } from "@/application/controllers";
import { UnauthorizedError } from "@/application/erros";
import { RequiredStringValidator } from "@/application/validation";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { AccessToken } from "@/domain/model";
import { MockProxy, mock } from "jest-mock-extended";

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let params: {
    token: string;
  }

  beforeAll(() => {
    params = {
      token: 'any_token'
    }
    facebookAuth = mock();
    facebookAuth.execute.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('Should build Validators correctly', () => {
    const validators = sut.buildValidators(params);
    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ]);
  });

  it('Should return 401 if authentication fails', async () => {;
    facebookAuth.execute.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle(params);
    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    })
  });

  it('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle(params);
    expect(facebookAuth.execute).toHaveBeenCalledWith(params);
    expect(facebookAuth.execute).toHaveBeenCalledTimes(1);
  });

  it('Should return 200 if Authentication success', async () => {
    const httpResponse = await sut.handle(params);
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value',
      }
    });
  });
});
