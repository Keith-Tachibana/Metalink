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

app.get('/api/concerts/:postalCode', (req, res, next) => {
  const { postalCode } = req.params;
  const ticketMasterApiKey = process.env.ticketMasterAPI_KEYJC;
  const metalClassificationId = 'KnvZfZ7vAvt';
  const ticketMasterUrl = `
  https://app.ticketmaster.com/discovery/v2/events.json?apikey=${ticketMasterApiKey}&postalCode=${postalCode}&classificationId=${metalClassificationId}`;
  fetch(ticketMasterUrl)
    .then(res => res.json())
    .then(results => {
      if (typeof results._embedded === 'undefined') return res.status(400).json({ error: 'No events found' });
      else {
        const parsedEvents = results._embedded.events.map(obj => {
          const venues = obj._embedded.venues[0];
          return {
            name: obj.name,
            date: obj.dates.start.localDate,
            venues: venues.name,
            location: `${venues.city.name}, ${venues.state.stateCode}`,
            image: obj.images[0].url
          };
        });
        res.status(200).json(parsedEvents);
      }
    })
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
