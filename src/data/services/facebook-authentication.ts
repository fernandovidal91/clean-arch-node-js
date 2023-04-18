import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { LoadUserAccountRepository } from "../contracts/repositories";

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUserApi.loadUser(params)
    if (facebookData) {
      await this.loadUserAccountRepository.load({ email: facebookData.email })
    }
    return new AuthenticationError();
  }
}
