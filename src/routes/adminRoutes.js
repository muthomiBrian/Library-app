const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRouter');
const chalk = require('chalk');

const adminRouter = express.Router();

function router(books) {
  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async () => {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug(`Connected correctly to the server at ${chalk.green(url)}`);

          const db = client.db(dbName);

          const response = await db.collection('books').insertMany(books);
          res.json(response);
        } catch (err) {
          debug(err.stack);
        }

        client.close();
      })();
    });
  return adminRouter;
}

module.exports = router;
