import { AuthenticationError } from "@/domain/errors";
import { FacebookAuthentication } from "@/domain/features";
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from "../contracts/repositories";
import { AccessToken, FacebookAccount } from "@/domain/model";
import { TokenGenerator } from "@/domain/contracts/crypto";
import { LoadFacebookUserApi } from "@/domain/contracts/apis";

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor(
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,
  ) {}

  async execute(params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const facebookData = await this.facebookApi.loadUser(params);

    if (facebookData) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.email });
      const facebookAccount = new FacebookAccount(facebookData, accountData);
      const { id } = await this.userAccountRepository.saveWithFacebook(facebookAccount);
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs });
      return new AccessToken(token);
    }

    return new AuthenticationError();
  }
}
