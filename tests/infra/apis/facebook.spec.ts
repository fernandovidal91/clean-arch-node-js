import { MockProxy, mock } from "jest-mock-extended";

import { HttpGetClient } from "@/infra/http";
import { FacebookApi } from "@/infra/apis";

describe('FacebookApi', () => {
  let clientId: string;
  let clientSecret: string;

  let sut: FacebookApi;
  let httpClient: MockProxy<HttpGetClient>

  beforeAll(() =>{
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret'
    httpClient = mock();
  });

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({ access_token: 'any_app_token' })
      .mockResolvedValueOnce({ data: { user_id: 'any_user_id' } })
      .mockResolvedValueOnce({
        id: 'any_facebook_id',
        name: 'any_facebook_name',
        email: 'any_facebook_email',
      });
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it('Should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' });
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    });
  });

  it('Should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' });
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token',
      }
    });
  });

  it('Should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token' });
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        input_token: 'any_client_token',
      },
    });
  });
  it('Should return facebook user', async () => {
    const facebookData = await sut.loadUser({ token: 'any_client_token' });
    expect(facebookData).toEqual({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
    });
  });
});
