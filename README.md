# Metalink
A mobile-first, full-stack, web application for lovers of metal music that aims to link them with other fans of the genre
## Developed By
[Jack Chou](https://github.com/jackmchou), [Andrew Song](https://github.com/andrewsong11), and [Keith Tachibana](https://github.com/Keith-Tachibana)
## Technologies Used
|            **Dependency**          | **Version** |
|------------------------------------|------------:|
| @Babel/Core                        |   7.8.0     |
| @Babel/Plugin-Transform-React-JSX  |   7.8.0     |
| Axios                              |   0.19.2    |
| Babel-Loader                       |   8.0.6     |
| Bcrypt                             |   4.0.1     |
| Bootstrap                          |   4.4.1     |
| CORS                               |   2.8.5     |
| Disconnect                         |   1.2.1     |
| Dotenv                             |   8.2.0     |
| Express                            |   4.17.1    |
| Express-Session                    |   1.17.0    |
| FontAwesome                        |   5.11.2    |
| Lodash                             |   4.17.15   |
| Moment                             |   2.24.0    |
| Multer                             |   1.4.2     |
| Node-Fetch                         |   2.6.0     |
| Node-Mailer                        |   0.1.1     |
| PG                                 |   7.17.1    |
| PM2                                |   4.2.3     |
| PostgreSQL                         |   10.10     |
| React                              |   16.12.0   |
| React-DOM                          |   16.12.0   |
| React-Router-DOM                   |   5.1.2     |
| Session-File-Store                 |   1.3.1     |
| Socket.io                          |   2.3.0     |
| Webpack                            |   4.41.5    |
| Webpack-CLI                        |   3.3.10    |
| YouTube-API-Search                 |   0.0.5     |
## Live Demo
Try the application live [on my portfolio website](https://metalink.keith-tachibana.com/)
## Features
- _*_ Users can register for an account by setting up a password which gets hashed and saved in the database
- _*_ Users can authenticate themselves at the login page using said password
- _*_ Users can reset their password and be sent an e-mail containing a password reset link that expires in 1 hour using a token
- _*_ Users can post comments, album reviews, or other information for others to see when they log into the application, sorted by date from most recent to oldest
- _*_ Users can add a profile to their account, including a profile picture, screen name, e-mail address, real name, location, phone number, and favorite sub-genres of metal
- _*_ Users can view their individual post history (if any) and edit or delete them
- _*_ Users can search for concerts via the TicketMaster API and see the results in tabular format
- _*_ Users can also view the concert search results on Google Maps as clickable, animated markers with the corresponding concert information
- _*_ Users can join a global chat session with other currently logged-in users and message each other in real-time
- _*_ Users can log out and rejoin the chat room and still see all previous chat messages
- _*_ Users can search for band profiles using the Discogs API
- _*_ Users can search for YouTube videos and play them inside the application
## Preview
![Metalink Preview](preview.gif "Metalink Preview")
## Development
- _*_ [DB Designer available here](https://app.dbdesigner.net/designer/schema/312595)
- _*_ [Figma available here](https://www.figma.com/file/pzkKz7ZmE00RLNJQBJOxA7/MetaLink?node-id=0%3A1)
- _*_ [MeisterTask available here](https://www.meistertask.com/app/project/i8BR5WmN/metalink)
- _*_ [Wireframe available here](https://github.com/Keith-Tachibana/Metalink/wiki)
#### System Requirements
|  **Requirement**  |   **Version**    |
|-------------------|-----------------:|
| Nginx             | 1.10 or higher   |
| Node              | 10 or higher     |
| NPM               | 6 or higher      |
| PM2               | 4 or higher      |
| PostgreSQL        | 10 or higher     |
| Ubuntu Server     | 18.04 LTS        |
#### Getting Started
1. Clone the repository
  ```shell
  git clone https://github.com/Keith-Tachibana/Metalink.git
  ```
2. Change directory to cloned folder
  ```shell
  cd Metalink/
  ```
3. Install all dependencies with NPM
  ```shell
  npm install
  ```
4. Start PostgreSQL server
  ```shell
  sudo service postgresql start
  ```
5. Create the database
  ```shell
  createdb metalink
  ```
6. Import the schema and dummy data
  ```shell
  npm run db:import
  ```
7. Edit your nginx default site configuration to reverse proxy the Express.js server
  ```shell
  cd /etc/nginx/sites-available
  sudo nano default
  ```
   - 7a. In the "server" code block, add this underneath the first location definition:
  ```shell
  location /api {
    proxy_pass http://127.0.0.1:3001;
  }
  
  location /socket.io {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }
  ```
   - 7b. Save your changes (`Ctrl + O`) and exit (`Ctrl + X`)
   - 7c. Link your default site to the sites-enabled directory (if not already done):
  ```shell
  sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
  ```
8. Start nginx
  ```shell
  sudo service nginx start
  ```
9. Make a copy of the .env.example file, update it with your PostgreSQL credentials, and add your API keys to it
  ```shell
  cp .env.example .env
  ```
- 9a. You'll need API keys for the following: [Discogs](https://www.discogs.com/developers), [TicketMaster](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/), and [YouTube](https://developers.google.com/youtube/v3/getting-started)
10. Transpile React components using Webpack
  ```shell
  npm run build
  ```
11. Start the Express.js server using the PM2 module
  ```shell
  sudo pm2 --name "Metalink" start "npm run start"
  ```
12. Open your default web browser and navigate to http://localhost:3000/ to see the result!
