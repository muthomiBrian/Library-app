const debug = require('debug')('app:bookController');
const { MongoClient, ObjectID } = require('mongodb');
const chalk = require('chalk');

function bookController(nav, url, dbName, bookService) {
  function getIndex(req, res) {
    (async () => {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug(`Connected correctly to the server at ${chalk.green(url)}`);

        const db = client.db(dbName);

        const col = await db.collection('books');

        const books = await col.find().toArray();

        res.render('bookListView',
          {
            nav,
            title: 'Library',
            books,
          });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    })();
  }

  function getById(req, res) {
    const { id } = req.params;
    (async () => {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug(`Connected correctly to the server at ${chalk.green(url)}`);

        const db = client.db(dbName);

        const col = await db.collection('books');

        const book = await col.findOne({ _id: new ObjectID(id) });

        book.details = await bookService.getBookById(book.bookId);

        res.render('bookView',
          {
            nav,
            title: 'Library',
            book,
          });
      } catch (err) {
        debug(err.stack);
      }
    })();
  }

  function checkAuth(req, res, next) {
    // if (req.user) {
    next();
    // } else {
    //   res.redirect('/');
    // }
  }

  return {
    getIndex,
    getById,
    checkAuth,
  };
}

module.exports = bookController;