import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookAuthenticationService } from "@/data/services";
import { AuthenticationError } from "@/domain/errors";
import { LoadFacebookUserApi } from '@/data/contracts/apis';
import { LoadUserAccountRepository } from '@/data/contracts/repositories';

describe('FacebookAuthenticationService', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
  let sut: FacebookAuthenticationService;
  const params = { token: 'any_token' };

  beforeEach(() => {
    loadFacebookUserApi = mock();
    loadUserAccountRepository = mock();
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_facebook_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebook_id',
    });
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository);
  });

  it('Should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform(params);
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith(params)
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined);
    const authResult = await sut.perform(params);
    expect(authResult).toEqual(new AuthenticationError())
  });

  it('Should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.perform(params);
    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1);
  });
});
