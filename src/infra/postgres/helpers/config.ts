import { ConnectionOptions } from "typeorm";

export const config: ConnectionOptions = {
  host: 'lallah.db.elephantsql.com',
  port: 5432,
  username: 'kydghccr',
  password: 'bw0DoPwmW9X85xqBSuP6PfDBw10gS9EV',
  database: 'kydghccr',
  entities: ['dist/infra/postgres/entities/index.js'],
  type: 'postgres',
}
