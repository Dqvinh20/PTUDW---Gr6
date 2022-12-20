import knexObj from 'knex';

export default knexObj({
  client: 'pg',
  version: '7.2',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'root',
    password : '123456',
    database : 'postgres'
  }
});