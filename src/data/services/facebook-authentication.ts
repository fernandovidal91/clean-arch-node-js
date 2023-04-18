import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from "../contracts/repositories";

export class FacebookAuthenticationService {
  constructor(
    private readonly loadFacebookUserApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookAccountRepository: CreateFacebookAccountRepository
  ) {}

  async perform(params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const facebookData = await this.loadFacebookUserApi.loadUser(params)
    if (facebookData) {
      await this.loadUserAccountRepository.load({ email: facebookData.email })
      await this.createFacebookAccountRepository.createFromFacebook(facebookData)
    }
    return new AuthenticationError();
  }
}
