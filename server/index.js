require('dotenv/config');
const express = require('express');
const path = require('path');
const multer = require('multer');
const fetch = require('node-fetch');
const Discogs = require('disconnect').Client;

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();
const discogsDB = new Discogs().database();

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
  if (typeof userId === 'undefined') { throw new ClientError('The userId is required.', 400); } else {
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
  order by "postId" asc;
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

app.get('/api/bands/:band', async (req, res, next) => {
  const { band } = req.params;
  const query = band.split(' ').join('+');
  const apiKey = process.env.DISCOGS_API_KEY;
  const apiSecret = process.env.DISCOGS_API_SECRET;
  const response = await fetch(`http://api.discogs.com/database/search?type=artist&q=${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Discogs key=${apiKey}, secret=${apiSecret}`
    }
  });
  const result = await response.json();
  if (!result) {
    throw new ClientError('No results found.', 400);
  } else {
    res.status(200).send({
      band: result.results[0].title,
      image: result.results[0].cover_image,
      id: result.results[0].id
    });
  }
});

app.get('/api/discogs/:id', async (req, res, next) => {
  const { id } = req.params;
  await discogsDB.getArtist(id, (err, data) => {
    if (data) {
      res.status(200).send({
        profile: data.profile
      });
    } else {
      next(err);
    }
  });
});

app.delete('/api/posts/:postId', (req, res, next) => {
  const { postId } = req.params;
  if ((!parseInt(postId, 10)) || (parseInt(postId) < 0)) {
    throw new ClientError('The postId must be a positive integer', 400);
  }
  const params = [postId];
  const sql = `
    DELETE FROM "posts"
          WHERE "postId" = $1
      RETURNING *;
  `;
  db.query(sql, params)
    .then(result => {
      const post = result.rows[0];
      if (!post) {
        res.status(404).json({
          error: `Cannot find post with postId ${postId}.`
        });
      } else {
        res.status(204).json(post);
      }
    })
    .catch(err => next(err));
});

app.patch('/api/profile/:userId', (req, res, next) => {
  const { name, username, email, location, phone, profileImage, genre1, genre2, genre3 } = req.body;
  const { userId } = req.params;
  if ((!parseInt(userId, 10)) || (parseInt(userId) < 0)) {
    throw new ClientError('The userId must be a positive integer.', 400);
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
        throw new ClientError(`Cannot find user with userId ${userId}`, 404);
      } else {
        res.status(200).json(profile);
      }
    })
    .catch(err => next(err));
});

app.post('/api/profileImage', upload.single('profileImage'), (req, res, next) => {
  if (!req.file) {
    throw new ClientError('File not received!', 400);
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
      .catch(err => next(err));
  }
});

app.post('/api/login', (req, res) => {
  if (!req.session.userId) req.session.userId = req.body.userId;
  const { userId } = req.session;
  if (!userId) { throw new ClientError('Invalid userId', 400); } else return res.status(200).json({ success: `${userId} Logged in!` });
});

app.post('/api/logout', (req, res) => {
  const { userId } = req.session;
  if (!userId) return res.status(400).json({ error: `No userId ${userId} in session` });
  else {
    delete req.session.userId;
    return res.status(200).json({ success: `User ${userId} logged out!` });
  }
});

app.put('/api/posts/:postId', (req, res, next) => {
  const { subject, content } = req.body;
  const { postId } = req.params;
  if ((!parseInt(postId, 10)) || (parseInt(postId, 10) < 0)) {
    throw new ClientError('The postId must be a positive integer.', 400);
  }
  const values = [subject, content, postId];
  const sql = `
      UPDATE "posts"
        SET "subject" = $1, "content" = $2
      WHERE "postId" = $3
  RETURNING *;
  `;
  db.query(sql, values)
    .then(result => {
      const post = result.rows;
      if (!post) {
        throw new ClientError(`Cannot find post with postId ${postId}`, 404);
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'An unexpected error occurred.'
      });
    });
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
