import { setupFacebookAuthentication, FacebookAuthentication } from "@/domain/use-cases";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepository } from "@/main/factories/repositories";
import { makeJwtTokenHandler } from "@/main/factories/crypto";

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAuthentication(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenHandler()
  );
}
