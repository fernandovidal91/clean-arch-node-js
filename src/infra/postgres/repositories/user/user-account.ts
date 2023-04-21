import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repositories";
import { PgUser } from "@/infra/postgres/entities";

import { Repository, getRepository } from "typeorm";

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const repository = getRepository(PgUser);
    const pgUser = await repository.findOne({ email: params.email });
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      }
    }
    return undefined;
  }

  async saveWithFacebook(params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const repository = getRepository(PgUser);

    let id: string;

    if (!params.id) {
      const pgUser = await repository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId,
      });

      id = pgUser.id.toString();
    } else {
      id = params.id;

      await repository.update({
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
