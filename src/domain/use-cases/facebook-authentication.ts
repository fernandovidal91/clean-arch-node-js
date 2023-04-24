import { AuthenticationError } from "@/domain/entities/errors";
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from "../contracts/repositories";
import { AccessToken, FacebookAccount } from "@/domain/entities";
import { TokenGenerator } from "@/domain/contracts/crypto";
import { LoadFacebookUserApi } from "@/domain/contracts/apis";

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator,
) => FacebookAuthentication;

export type FacebookAuthentication = (params: { token: string }) => Promise<AccessToken | AuthenticationError>;

export const setupFacebookAuthentication: Setup = (facebookApi, userAccountRepository, crypto) => async params => {
  const facebookData = await facebookApi.loadUser(params);

  if (facebookData) {
    const accountData = await userAccountRepository.load({ email: facebookData.email });
    const facebookAccount = new FacebookAccount(facebookData, accountData);
    const { id } = await userAccountRepository.saveWithFacebook(facebookAccount);
    const token = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs });
    return new AccessToken(token);
  }

  return new AuthenticationError();
}
