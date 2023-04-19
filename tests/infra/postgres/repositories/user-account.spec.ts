import { PgUserAccountRepository } from '@/infra/postgres/repositories';
import { PgUser } from '@/infra/postgres/entities';

import { IBackup } from 'pg-mem';
import { Repository, getConnection, getRepository } from "typeorm";
import { makeFakeDb } from '@/tests/infra/postgres/mocks';

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepository: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    pgUserRepository = getRepository(PgUser);
    backup = db.backup();
  })

  beforeEach(() => {
    backup.restore();
    sut = new PgUserAccountRepository();
  })

  afterAll(async () => {
    await getConnection().close();
  })

  describe('load()', () => {
    it('Should return an account if email exists', async () => {
      await pgUserRepository.save({ email: 'existing_email' });
      const account = await sut.load({ email: 'existing_email' });
      expect(account).toEqual({ id: '1' });
    });

    it('Should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' });
      expect(account).toBe(undefined);
    });
  });

  describe('saveWithFacebook()', () => {
    it('Should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_facebook_id',
      });
      const pgUser = await pgUserRepository.findOne({ email: 'any_email' });
      expect(pgUser?.id).toBe(1);
      expect(id).toBe('1');
    });

    it('Should create an account if id is defined', async () => {
      await pgUserRepository.save({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_facebook_id',
      });

      const { id } = await sut.saveWithFacebook({
        id: '1',
        name: 'new_name',
        email: 'any_email',
        facebookId: 'new_facebook_id',
      });

      const pgUser = await pgUserRepository.findOne({ id: 1 });

      expect(pgUser).toEqual({
        id: 1,
        name: 'new_name',
        email: 'any_email',
        facebookId: 'new_facebook_id',
      });
      expect(id).toBe('1');
    });
  });
})
