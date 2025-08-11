const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432, // Puerto por defecto de PostgreSQL
  user: 'upsbet_user', // El que creaste en pgAdmin
  password: '12345',
  database: 'upsbet_db' // La que creaste en PostgreSQL
});

client.connect()
  .then(() => console.log('Conexión exitosa a PostgreSQL'))
  .catch(err => console.error('Error de conexión', err))
  .finally(() => client.end());
