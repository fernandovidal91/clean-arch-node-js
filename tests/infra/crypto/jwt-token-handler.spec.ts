import { JwtTokenHandler } from '@/infra/crypto';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secret: string;

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
  })

  beforeEach(() => {
    sut = new JwtTokenHandler(secret);
  })

  describe('generateToken', () => {
    let key: string;
    let expirationInMs: number
    let token: string;

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt.sign.mockImplementation(() => token);
    })

    it('Should call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs });
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
      expect(fakeJwt.sign).toHaveBeenCalledWith({
        key
      }, secret, {
        expiresIn: 1,
      });
    });

    it('Should return a token', async () => {
      const generateToken = await sut.generateToken({ key, expirationInMs });
      expect(generateToken).toBe(token);
    });

    it('Should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') });
      const promise = sut.generateToken({ key, expirationInMs });
      await expect(promise).rejects.toThrow(new Error('token_error'));
    });
  })

  describe('validateToken', () => {
    let token: string;
    let key: string;

    beforeAll(() => {
      token = 'any_token'
      key = 'any_key'
      fakeJwt.verify.mockImplementation(() => ({ key }));
    })

    it('Should call sign with correct params', async () => {
      await sut.validateToken({ token });
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1)
      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret);
    });

    it('Should return the key used to sign', async () => {
      const generatedKey = await sut.validateToken({ token });
      expect(generatedKey).toBe(key);
    });

    it('Should throw if verify returns null', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null);
      const promise = sut.validateToken({ token });
      await expect(promise).rejects.toThrow();
    });
  })
});
