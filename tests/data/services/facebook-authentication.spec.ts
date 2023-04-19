import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';
import { TokenGenerator } from '@/data/contracts/crypto';
import { AccessToken } from '@/domain/model';

jest.mock('@/domain/model/facebook-account', () => {
  return {
    FacebookAccount: jest.fn().mockImplementation(() => {
      return {
        any: 'any'
      }
    }),
  }
})

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
  const params = { token: 'any_token' };

  beforeEach(() => {
    facebookApi = mock();
    userAccountRepository = mock();
    crypto = mock();
    userAccountRepository.load.mockResolvedValue(undefined);
    userAccountRepository.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id',
    });
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id',
    });
    crypto.generateToken.mockResolvedValue('any_generated_token');
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository, crypto);
  });

  it('Should call facebookApi with correct params', async () => {
    await sut.perform(params);
    expect(facebookApi.loadUser).toHaveBeenCalledWith(params)
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError when facebookApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform(params);
    expect(authResult).toEqual(new AuthenticationError())
  });

  it('Should call LoadUserAccountRepository when facebookApi returns data', async () => {
    await sut.perform(params);
    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('Should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    await sut.perform(params);
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any',
    });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should call TokenGenerator with correct params', async () => {
    await sut.perform(params);
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('Should return an AccessToken on success', async () => {
    const authResult = await sut.perform(params);
    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });

  it('Should rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('facebook_error'));
    const promise = sut.perform(params);
    await expect(promise).rejects.toThrow(new Error('facebook_error'))
  });

  it('Should rethrow if LoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'));
    const promise = sut.perform(params);
    await expect(promise).rejects.toThrow(new Error('load_error'))
  });

  it('Should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));
    const promise = sut.perform(params);
    await expect(promise).rejects.toThrow(new Error('save_error'))
  });

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));
    const promise = sut.perform(params);
    await expect(promise).rejects.toThrow(new Error('token_error'))
  });
});
