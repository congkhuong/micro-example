const sqlite3 = require('sqlite3').verbose();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPass = bcrypt.hashSync('123456', salt);
// $2b$10$QAC04hwzVuipjkrYGFhrWuPZ8.YUYanZJXrCjJp2sH9wrtTFfjmYi


// Connect to a SQLite database file
const db = new sqlite3.Database('./local.db', (err) => {
  if (err) {
    console.error(err.message);
  }

  console.log('Connected to the users.db database.');
});

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    name TEXT,
    password TEXT
  )
`, (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    name TEXT,
    description TEXT
  )
`, (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});

// db.run(`DELETE FROM user`);

// Insert data into the table
// db.run(`
//   INSERT INTO user (name, password)
//   VALUES ('admin', "$2b$10$FqUbgfnpNjSDs9.fROr3WekOU2tfrWzmE4E.pEDt4R41kyv1VjTQS")
// `);

// db.run(`
//   INSERT INTO task (user_id, name, description)
//   VALUES (1, 'Test', 'Test')
// `);

db.each(`SELECT * FROM user`, (err, row) => {
  if (err) {
    throw err;
  }
  console.log('row', row)
});

db.each(`SELECT * FROM task`, (err, row) => {
  if (err) {
    throw err;
  }
  console.log('row', row);
});

db.on('error', (err) => {
  console.log('err', err);
})
// Close the database connection
db.close();
