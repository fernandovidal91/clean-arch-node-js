import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { PgUser } from "@/infra/postgres/entities";

import { Repository, getRepository } from "typeorm";

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly repository: Repository<PgUser>;

  constructor() {
    this.repository = getRepository(PgUser);
  }

  async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.repository.findOne({ email: params.email });
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      }
    }
    return undefined;
  }

  async saveWithFacebook(params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    let id: string;

    if (!params.id) {
      const pgUser = await this.repository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });

      id = pgUser.id.toString();
    } else {
      id = params.id;

      await this.repository.update({
        id: parseInt(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      });
    }

    return {
      id
    };
  }
}
