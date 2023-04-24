import { FacebookAuthenticationUseCase } from "@/domain/use-cases";
import { makeFacebookApi } from "@/main/factories/apis";
import { makePgUserAccountRepository } from "@/main/factories/repositories";
import { makeJwtTokenGenerator } from "@/main/factories/crypto";

export const makeFacebookAuthenticationUseCase = (): FacebookAuthenticationUseCase => {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePgUserAccountRepository(),
    makeJwtTokenGenerator()
  );
}
