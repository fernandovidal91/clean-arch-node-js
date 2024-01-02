
import { Middleware } from "@/application/middlewares"
import { adaptExpressMiddleware } from "@/main/adapters"
import { getMockReq, getMockRes } from "@jest-mock/express"
import { NextFunction, Request, RequestHandler, Response } from "express"
import { MockProxy, mock } from "jest-mock-extended"

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let middleware: MockProxy<Middleware>
  let sut: RequestHandler

  beforeAll(() => {
    req = getMockReq({ headers: {any: 'any'} })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock<Middleware>()
    middleware.handler.mockResolvedValue({
      statusCode: 200,
      data: {
        emptyProp: '',
        nullProp: null,
        undefinedProp: undefined,
        prop: 'any_value'
      }
    })
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it ('Should call handler with correct request', async () => {
    await sut(req, res, next)
    expect(middleware.handler).toHaveBeenCalledTimes(1)
    expect(middleware.handler).toHaveBeenCalledWith({any: 'any'})
  })

  it ('Should call handler with empty request', async () => {
    req = getMockReq()
    await sut(req, res, next)
    expect(middleware.handler).toHaveBeenCalledTimes(1)
    expect(middleware.handler).toHaveBeenCalledWith({})
  })

  it('Should respond with correct error and status code', async () => {
    middleware.handler.mockResolvedValueOnce({ statusCode: 500, data: { error: 'any_error' } })
    await sut(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('Should add valid data to req.locals', async () => {
    await sut(req, res, next)
    expect(req.locals).toEqual({ prop: 'any_value' })
    expect(next).toHaveBeenCalledTimes(1)
  })
})
