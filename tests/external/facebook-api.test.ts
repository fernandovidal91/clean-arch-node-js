import { FacebookApi } from "@/infra/apis"
import { AxiosHttpClient } from "@/infra/http";
import { env } from '@/main/config/env';

describe('Facebook Api Integration Tests', () => {
  let axiosClient: AxiosHttpClient;
  let sut: FacebookApi;

  beforeEach(() => {
    axiosClient = new AxiosHttpClient();
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    );
  });

  // it('Should return a Facebook User if token is valid', async () => {
  //   const facebookUser = await sut.loadUser({ token: '123' });
  //   expect(facebookUser).toEqual({
  //     facebookId: '',
  //     email: '',
  //     name: '',
  //   });
  // });

  it('Should return undefined if token is invalid', async () => {
    const facebookUser = await sut.loadUser({ token: 'invalid_token' });
    expect(facebookUser).toBeUndefined();
  });
})
