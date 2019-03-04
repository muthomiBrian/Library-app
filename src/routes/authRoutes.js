const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRouter');
const chalk = require('chalk');
const passport = require('passport')

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signup')
    .post((req, res) => {
      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async () => {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug(`Connected correctly to ${chalk.green(dbName)} at ${chalk.green(url)}`);
          const db = client.db(dbName);
          const col = db.collection('users');
          const user = { username, password };
          const results = await col.insertOne(user);
          debug(results);
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (error) {
          debug(error);
        }
      })();
    });

  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Sign in',
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    }));

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  return authRouter;
}

module.exports = router;
