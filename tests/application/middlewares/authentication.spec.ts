import { ForbiddenError } from "@/application/erros";
import { AuthenticationMiddleware } from "@/application/middlewares";

describe('Authentication Middleware', () => {
  let sut: AuthenticationMiddleware
  let authorize: jest.Mock
  let authorization: string;

  beforeEach(() => {
    authorize = jest.fn().mockResolvedValue('any_user_id')
    sut = new AuthenticationMiddleware(authorize);
    authorization = 'any_authorization_token'
  })

  it('Should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should call authorize with correct input ', async () => {
    await sut.handle({ authorization })
    expect(authorize).toHaveBeenCalledWith({ token: authorization })
    expect(authorize).toHaveBeenCalledTimes(1)
  })

  it('Should return 403 if authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle({ authorization })
    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('Should return 200 if user_id on success', async () => {
    const httpResponse = await sut.handle({ authorization })
    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        userId: 'any_user_id'
      }
    })
  })
})
