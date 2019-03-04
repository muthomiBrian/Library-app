const express = require('express');

const bookController = require('../controllers/bookController');
const bookService = require('../services/goodReadsService');

const bookRouter = express.Router();
const url = 'mongodb://localhost:27017';
const dbName = 'libraryApp';

function router(nav) {
  const { getIndex, getById, checkAuth } = bookController(nav, url, dbName, bookService);
  bookRouter.use(checkAuth);

  bookRouter.route('/')
    .get(getIndex);

  bookRouter.route('/:id')
    .get(getById);

  return bookRouter;
}

module.exports = router;
