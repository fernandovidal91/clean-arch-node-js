import { TokenGenerator, TokenValidator } from "@/domain/contracts/crypto";
import jwt, { JwtPayload } from 'jsonwebtoken';

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor(private readonly secret: string) {}

  async validateToken (params: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = jwt.verify(params.token, this.secret) as JwtPayload
    return payload.key;
  }

  async generateToken(params: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;
    const token = jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })
    return token;
  }
}
