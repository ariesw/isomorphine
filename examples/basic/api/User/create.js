let db = require('../../server/async-db');

export default function createUser(user, callback) {

  // Do the DB query, etc
  console.log('Creating a new user...');

  db.User.create(user, callback);
}