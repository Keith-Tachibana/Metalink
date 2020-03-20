require('dotenv/config');
const express = require('express');
const path = require('path');
const multer = require('multer');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');
const fetch = require('node-fetch');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);
app.use(express.json());

const storage = multer.diskStorage({
  destination: './server/public/images/profileImages',
  filename: function (req, file, cb) {
    cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage
});

app.get('/api/users', (req, res, next) => {
  const sql = `
    select "userId",
           "name",
           "username",
           "email",
           "location"
           "createdAt"
      from "users"
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/profile/:userId', (req, res, next) => {
  const { userId } = req.params;
  if (typeof userId === 'undefined') return res.status(400).json({ error: 'userId required' });
  else {
    const sql = `
    SELECT "userId", "name", "username", "email", "location", "phone", "profileImage", "genre1", "genre2", "genre3"
      FROM "users"
     WHERE "userId" = $1;
  `;
    db.query(sql, [userId])
      .then(result => {
        const profile = result.rows;
        res.status(200).send({
          userId: profile[0].userId,
          name: profile[0].name,
          username: profile[0].username,
          email: profile[0].email,
          location: profile[0].location,
          phone: profile[0].phone,
          profileImage: profile[0].profileImage,
          genre1: profile[0].genre1,
          genre2: profile[0].genre2,
          genre3: profile[0].genre3
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'An unexpected error occurred.'
        });
      });
  }
});

app.get('/api/posts', (req, res, next) => {
  const sql = `
    select "p"."postId",
           "p"."userId",
           "p"."subject",
           "p"."content",
           "p"."datePosted",
           "u"."username"
      from "posts" as "p"
      join "users" as "u" using ("userId")
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
  if (!(/^\d{5}(?:[-\s]\d{4})?$/g.test(postalCode))) return res.status(400).json({ error: 'Invalid zip code' });
  else {
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
              image: obj.images[0].url,
              genre: obj.classifications[0].genre.name
            };
          });
          return res.status(200).json(parsedEvents);
        }
      })
      .catch(err => next(err));
  }
});

app.patch('/api/profile/:userId', (req, res, next) => {
  const { name, username, email, location, phone, profileImage, genre1, genre2, genre3 } = req.body;
  const { userId } = req.params;
  if ((!parseInt(userId, 10)) || (parseInt(userId) < 0)) {
    throw new ClientError('"userId" must be a positive integer.', 400);
  } else if (!name || !username || !email || !location) {
    throw new ClientError('Name, username, e-mail, AND location are required.', 400);
  }
  const values = [name, username, email, location, phone, profileImage, genre1, genre2, genre3, userId];
  const sql = `
    UPDATE "users"
       SET "name" = $1, "username" = $2, "email" = $3, "location" = $4, "phone" = $5, "profileImage" = $6, "genre1" = $7, "genre2" = $8, "genre3" = $9
     WHERE "userId" = $10
 RETURNING *;
  `;
  db.query(sql, values)
    .then(result => {
      const profile = result.rows;
      if (!profile) {
        res.status(404).json({
          error: `Cannot find user with userId ${userId}.`
        });
      } else {
        res.status(200).json(profile);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
});

app.post('/api/profileImage', upload.single('profileImage'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'File not received!'
    });
  } else {
    const sql = `
      UPDATE "users"
         SET "profileImage" = $1
       WHERE "userId" = 1
   RETURNING *;
    `;
    db.query(sql, ['/images/profileImages/' + req.file.filename])
      .then(result => {
        const profileImage = result.rows;
        if (!profileImage) {
          res.status(404).json({
            error: 'Cannot find user with that userId.'
          });
        } else {
          res.status(200).send(`./images/profileImages/${req.file.filename}`);
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'An unexpected error occurred.'
        });
      });
  }
});
app.get('/api/login', (req, res, next) => {

});
app.post('/api/login', (req, res, next) => {
  req.body.userId = req.session;
  const { userId } = req.session;
  res.status(200).json(userId);
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
