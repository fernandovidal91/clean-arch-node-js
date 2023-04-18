import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from "../contracts/repositories";

export class FacebookAuthenticationService {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository,
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.facebookApi.loadUser(params);
    if (facebookData) {
      await this.userAccountRepository.load({ email: facebookData.email });
      await this.userAccountRepository.createFromFacebook(facebookData);
    }
    return new AuthenticationError();
  }
}
