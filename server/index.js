require('dotenv/config');
const express = require('express');
const path = require('path');
const multer = require('multer');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const socket = require('socket.io');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const YTSearch = require('youtube-api-search');
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
    SELECT "userId",
           "name",
           "username",
           "email",
           "zipcode",
           "createdAt"
      FROM "users";
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/auth', (req, res, next) => {
  if (!req.session.userId) return res.json({ user: null });
  const sql = `
    SELECT "userId", "name", "username", "email", "zipcode", "phone", "profileImage", "genre1", "genre2", "genre3"
    FROM  "users"
    WHERE "userId" = $1;`;
  db.query(sql, [req.session.userId])
    .then(result => {
      const user = result.rows[0];
      res.json({ user });
    })
    .catch(err => next(err));
});

app.get('/api/profile/:userId', (req, res, next) => {
  const { userId } = req.params;
  if (typeof userId === 'undefined') { throw new ClientError('The userId is required.', 400); } else {
    const sql = `
    SELECT "userId", "name", "username", "email", "zipcode", "phone", "profileImage", "genre1", "genre2", "genre3"
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
          zipcode: profile[0].zipcode,
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
    SELECT "p"."postId",
           "p"."userId",
           "p"."subject",
           "p"."content",
           "p"."datePosted",
           "u"."username"
      FROM "posts" AS "p"
      JOIN "users" AS "u" USING ("userId")
  ORDER BY "postId" DESC;
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
              url: obj.url,
              location: `${venues.city.name}, ${venues.state.stateCode}`,
              long: venues.location.longitude,
              lat: venues.location.latitude,
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
    return res.status(400).json({
      error: 'No results found.'
    });
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

app.get('/api/chat', (req, res, next) => {
  const sql = `
    SELECT "username", "message", "timeSent"
      FROM "chat";
  `;
  db.query(sql)
    .then(result => {
      if (result.rows.length === 0) {
        res.status(401).json({
          message: 'No chat messages found.'
        });
      } else {
        res.status(200).json(result.rows);
      }
    })
    .catch(err => next(err));
});

app.get('/api/reset', (req, res, next) => {
  const { resetPasswordToken } = req.query;
  const value = [resetPasswordToken];
  const sql = `
    SELECT "username"
      FROM "users"
     WHERE "resetPasswordToken" = $1
       AND TO_TIMESTAMP("resetPasswordExpires", 'YYYY-MM-DD HH24:MI:SS') > NOW();
  `;
  db.query(sql, value)
    .then(result => {
      if (result.rows.length === 0) {
        res.json('The password reset link is invalid or has expired.');
      } else {
        res.status(200).send({
          username: result.rows[0].username,
          message: 'The password reset link is valid.'
        });
      }
    })
    .catch(err => next(err));
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

app.post('/api/posts', (req, res, next) => {
  const values = [req.body.subject, req.body.content, req.session.userId];
  const sql = `
  INSERT INTO "posts" ("subject", "content", "userId")
  VALUES ($1, $2, $3)
  RETURNING *
  `;
  db.query(sql, values)
    .then(response => {
      res.status(201).json(response.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Internal service error'
      });
    });
});

app.post('/api/profileImage', upload.single('profileImage'), (req, res, next) => {
  if (!req.file) {
    throw new ClientError('File not received!', 400);
  } else {
    const sql = `
      UPDATE "users"
         SET "profileImage" = $1
       WHERE "userId" = $2
   RETURNING *;
    `;
    db.query(sql, ['/images/profileImages/' + req.file.filename, req.session.userId])
      .then(result => {
        const profileImage = result.rows;
        if (!profileImage) {
          res.status(404).json({
            error: 'Cannot find user with that userId.'
          });
        } else {
          res.status(200).send(`/images/profileImages/${req.file.filename}`);
        }
      })
      .catch(err => next(err));
  }
});

app.post('/api/signup', (req, res, next) => {
  const { fullname, password, username, email, zipcode, phone, genre1, genre2, genre3 } = req.body;
  bcrypt.hash(password, 12, (err, hash) => {
    if (err) {
      console.error(err.message);
    } else {
      const sql = `
        INSERT INTO "users" ("name", "password", "username", "email", "zipcode", "phone", "genre1", "genre2", "genre3")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *;
      `;
      const values = [fullname, hash, username, email, zipcode, phone, genre1, genre2, genre3];
      db.query(sql, values)
        .then(result => {
          res.status(201).json(result.rows[0]);
        })
        .catch(err => {
          if (err.code === '23505') {
            res.status(400).json('That name, username, or e-mail address already exists.');
          } else {
            next(err);
          }
        });
    }
  });
});

app.post('/api/login', (req, res, next) => {
  const { username, password } = req.body;
  const sql = `
    SELECT "password"
      FROM "users"
     WHERE "username" = $1;
  `;
  const idSQL = `
    SELECT "userId"
      FROM "users"
     WHERE "username" = $1;
  `;
  const value = [username];
  db.query(sql, value)
    .then(result => {
      if (result.rows.length === 0) {
        res.status(401).json({
          message: 'No user found with that username.'
        });
      } else {
        bcrypt.compare(password, result.rows[0].password, (err, compare) => {
          if (err) {
            console.error(err.message);
          } else if (!compare) {
            res.status(401).json({
              message: 'You entered an incorrect password.'
            });
          } else {
            db.query(idSQL, value)
              .then(idResult => {
                if (!idResult) {
                  throw new ClientError('No user found with that userId', 401);
                } else {
                  req.session.userId = idResult.rows[0].userId;
                  res.status(200).json(idResult.rows[0].userId);
                }
              })
              .catch(err => next(err));
          }
        });
      }
    })
    .catch(err => next(err));
});

app.post('/api/email', (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new ClientError('E-mail address is required.', 400);
  } else {
    const sql = `
      SELECT "username"
        FROM "users"
       WHERE "email" = $1;
    `;
    const value = [email];
    db.query(sql, value)
      .then(result => {
        if (result.rows.length === 0) {
          res.status(404).json({
            message: 'That e-mail address was not found.'
          });
        } else {
          const token = crypto.randomBytes(20).toString('hex');
          const updateSQL = `
            UPDATE "users"
               SET "resetPasswordToken" = $1, "resetPasswordExpires" = NOW() + INTERVAL '1 hour'
             WHERE "username" = $2;
          `;
          const updateValues = [token, result.rows[0].username];
          db.query(updateSQL, updateValues)
            .then(updateResult => {
              const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                  type: 'login',
                  user: `${process.env.EMAIL_ADDRESS}`,
                  pass: `${process.env.EMAIL_PASSWORD}`
                }
              });
              const mailOptions = {
                from: 'metalink.noreply@gmail.com',
                to: `${email}`,
                subject: 'Metalink: Here\'s Your Link to Reset Your Password',
                text:
                  'You are receiving this e-mail because you (or someone else) has requested a password reset.\n\n' +
                  'Please click on the following link, or paste the link into your browser to complete the process.\n\n' +
                  'You have 1 hour from the time this e-mail was sent to do so, then the link will expire.\n\n' +
                  `Here's the link: http://localhost:3000/reset/${token}\n\n` +
                  'If you did not request this, please ignore this e-mail and your password will remain unchanged.\n\n' +
                  'Thank you for using Metalink!\n'
              };
              transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                  console.error(error.message);
                } else {
                  res.status(200).json({
                    message: 'Password reset e-mail sent!'
                  });
                }
              });
            })
            .catch(err => next(err));
        }
      })
      .catch(err => next(err));
  }
});

app.post('/api/videos/:term', (req, res, next) => {
  const { term } = req.params;
  if (!term) {
    throw new ClientError('A search query is required.', 400);
  } else {
    YTSearch({ key: process.env.YOUTUBE_API_KEY, term }, videos => {
      res.status(200).json(videos);
    });
  }
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
        SET "subject" = $1, "content" = $2, "dateUpdated" = default
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

app.put('/api/profile/:userId', (req, res, next) => {
  const { name, username, email, zipcode, phone, profileImage, genre1, genre2, genre3 } = req.body;
  const { userId } = req.params;
  if ((!parseInt(userId, 10)) || (parseInt(userId) < 0)) {
    throw new ClientError('The userId must be a positive integer.', 400);
  }
  const values = [name, username, email, zipcode, phone, profileImage, genre1, genre2, genre3, parseInt(userId)];
  const sql = `
      UPDATE "users"
        SET "name" = $1, "username" = $2, "email" = $3, "zipcode" = $4, "phone" = $5, "profileImage" = $6, "genre1" = $7, "genre2" = $8, "genre3" = $9, "updatedAt" = default
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

app.put('/api/update', (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 12, (err, hash) => {
    if (err) {
      console.error(err.message);
    } else {
      const sql = `
    UPDATE "users"
       SET "password" = $1, "resetPasswordToken" = NULL, "resetPasswordExpires" = NULL
     WHERE "username" = $2
 RETURNING *;
  `;
      const value = [hash, username];
      if (username !== null) {
        db.query(sql, value)
          .then(result => {
            res.status(200).json({
              message: 'Password successfully updated.'
            });
          })
          .catch(err => next(err));
      } else {
        res.status(404).json({
          message: 'That username was not found.'
        });
      }
    }
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

const server = app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});

const io = socket(server);
let population = 0;

io.on('connection', socket => {
  let addedUser = false;

  socket.on('SEND_MESSAGE', (data, req, res, next) => {
    const { username, message, time } = data;
    const sendValues = [username, message, time];
    const sendSQL = `
      INSERT INTO "chat" ("userId", "username", "message", "timeSent")
           VALUES (
            (SELECT "userId" FROM "users" WHERE "username" = $1),
            $1, $2, $3)
        RETURNING *;
    `;
    db.query(sendSQL, sendValues)
      .catch(err => next(err));
  });

  socket.on('ADD_USER', username => {
    if (addedUser) {
      return null;
    }
    socket.username = username;
    ++population;
    addedUser = true;
    socket.emit('LOGIN', {
      population
    });
    socket.broadcast.emit('USER_CONNECTED', {
      username: socket.username,
      population
    });
  });

  socket.on('disconnect', () => {
    if (addedUser) {
      --population;
      socket.broadcast.emit('USER_DISCONNECTED', {
        username: socket.username,
        population
      });
    }
  });
});
