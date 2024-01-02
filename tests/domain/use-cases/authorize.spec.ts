
import { TokenValidator } from '@/domain/contracts/crypto';
import { Authorize, setupAuthorize } from '@/domain/use-cases';
import { mock, MockProxy } from 'jest-mock-extended';

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>;
  let sut: Authorize;
  let token: string;

  beforeAll(() => {
    crypto = mock();
    crypto.validateToken.mockResolvedValue('any_value')
  });

  beforeEach(() => {
    sut = setupAuthorize(crypto);
  });

  it('Should call TokenValidator with correct params', async () => {
    await sut({ token });
    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1);
  });

  it('Should return the correct access token', async () => {
    const response = await sut({ token })
    expect(response).toBe('any_value')
  });
});
