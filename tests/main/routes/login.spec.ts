import request from 'supertest';
import { app } from '@/main/config/app';
import { IBackup } from 'pg-mem';
import { makeFakeDb } from '@/tests/infra/postgres/mocks';
import { PgUser } from '@/infra/postgres/entities';
import { getConnection } from 'typeorm';
import { UnauthorizedError } from '@/application/erros';

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    const loadUserSpy = jest.fn();

    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSpy
      })
    }))

    let backup: IBackup;

    beforeAll(async () => {
      const db = await makeFakeDb([PgUser]);
      backup = db.backup();
    });

    beforeEach(() => {
      backup.restore();
    });

    afterAll(async () => {
      await getConnection().close();
    });

    it('Should return 200 with AccessToken', async  () => {
      loadUserSpy.mockResolvedValueOnce({
        facebookId: 'any_id',
        name: 'any_name',
        email: 'any_email'
      });

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200);
      expect(body.accessToken).toBeDefined();
    });

    it('Should return 401 with UnauthorizedError', async  () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401);
      expect(body.error).toBe(new UnauthorizedError().message);
    });
  })
})
