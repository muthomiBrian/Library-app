const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local-strategy');
const chalk = require('chalk');

module.exports = () => {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    }, (username, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      (async () => {
        let client;

        try {
          client = await MongoClient.connect(url);

          debug(`Connected correctly to ${chalk.green(dbName)}`);

          const db = await client.db(dbName);
          const col = await db.collection('users');

          const user = await col.findOne({ username });

          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          debug(err);
        }
        client.close();
      })();
    },
  ));
};
