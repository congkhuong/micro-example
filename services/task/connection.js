const { DataSource } = require('typeorm');

const Task = require('./entity/task');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './local.db',
  entities: [ Task ],
  logging: true
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database of TASK service is available');
  })
  .catch((err) => {
    console.error("Error during Data Source Database of TASK initialization", err);
  });

module.exports = AppDataSource;