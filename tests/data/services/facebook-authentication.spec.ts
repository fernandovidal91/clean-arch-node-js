import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repositories';

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
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
  let sut: FacebookAuthenticationService;
  const params = { token: 'any_token' };

  beforeEach(() => {
    facebookApi = mock();
    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(undefined);
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id',
    });
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository);
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
});
