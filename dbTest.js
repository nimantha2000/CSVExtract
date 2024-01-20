const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'abcd1234',
    port: 5432,  // default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => {
    console.log('Connected to the database');
    // You can perform database operations here
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.message);
  })
  .finally(() => {
    // Close the database connection when done
    client.end()
      .then(() => console.log('Connection closed'))
      .catch((error) => console.error('Error closing connection:', error.message));
  });
