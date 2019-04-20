const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');
const borrowsRouter = require('./routes/borrows');
const borrowRecordsRouter = require('./routes/borrowRecords');
const resourcesRouter = require('./routes/resources');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);
app.use('/borrows', borrowsRouter);
app.use('/borrowRecords', borrowRecordsRouter);
app.use('/resources', resourcesRouter);

module.exports = app;
