import { FacebookLoginController } from "@/application/controllers";
import { UnauthorizedError } from "@/application/erros";
import { RequiredStringValidator } from "@/application/validation";
import { AuthenticationError } from "@/domain/entities/errors";

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: jest.Mock;
  let params: {
    token: string;
  }

  beforeAll(() => {
    params = {
      token: 'any_token'
    }
    facebookAuth = jest.fn();
    facebookAuth.mockResolvedValue({ accessToken: 'any_value' });
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
    facebookAuth.mockRejectedValueOnce(new AuthenticationError());

    const httpResponse = await sut.handle(params);

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    })
  });

  it('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle(params);
    expect(facebookAuth).toHaveBeenCalledWith(params);
    expect(facebookAuth).toHaveBeenCalledTimes(1);
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
