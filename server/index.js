require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const fetch = require('node-fetch');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);
app.use(express.json());

app.get('/api/users', (req, res, next) => {
  const sql = `
    select "userId",
           "fullName",
           "screenName",
           "email",
           "location"
           "createdAt"
      from "users"
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/posts', (req, res, next) => {
  const sql = `
    select "postId",
           "userId",
           "subject",
           "content",
           "datePosted"
      from "posts"
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/concerts', (req, res, next) => {
  const apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?postalCode=92870&apikey=7SYDlvB5YYdcdbZgRXm4q2sBkxpHfv4w';
  fetch(apiUrl)
    .then(res => res.json())
    .then(events => events)
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
