import { NextFunction, Request, RequestHandler, Response } from "express";
import { MockProxy, mock } from "jest-mock-extended";

import { Controller } from "@/application/controllers";
import { getMockReq, getMockRes } from '@jest-mock/express';
import { adaptExpressRoute } from "@/infra/http";

describe('ExpressRouter', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let controller: MockProxy<Controller>;
  let sut: RequestHandler;

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } });
    res = getMockRes().res;
    next = getMockRes().next;
    controller = mock();
    controller.handle.mockResolvedValue({
      statusCode: 200,
      data: {
        data: 'any_data'
      }
    });
    sut = adaptExpressRoute(controller);
  })

  it('Should call handle with correct request', async () => {
    await sut(req, res, next);
    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('Should call handle with empty request', async () => {
    const req = getMockReq();
    await sut(req, res, next);
    expect(controller.handle).toHaveBeenCalledWith({});
    expect(controller.handle).toHaveBeenCalledTimes(1);
  });

  it('Should respond with 200 and valid data', async () => {
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      data: 'any_data'
    });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('Should respond with 400 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 400,
      data: new Error('any_error'),
    });
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });

  it('Should respond with 500 and valid error', async () => {
    controller.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error'),
    });
    await sut(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});