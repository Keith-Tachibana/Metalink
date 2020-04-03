# Metalink
A mobile-first, full-stack, web application for lovers of metal music that aims to link them with other fans of the genre
## Technologies Used
|              Dependency            | Version |
|------------------------------------|--------:|
| @Babel/Core                        | 7.8.0   |
| @Babel/Plugin-Transform-React-JSX  | 7.8.0   |
| Axios                              | 0.19.2  |
| Babel-Loader                       | 8.0.6   |
| Bcrypt                             | 4.0.1   |
| Bootstrap                          | 4.4.1   |
| CORS                               | 2.8.5   |
| Disconnect                         | 1.2.1   |
| Dotenv                             | 8.2.0   |
| Express                            | 4.17.1  |
| Express-Session                    | 1.17.0  |
| FontAwesome                        | 5.11.2  |
| Lodash                             | 4.17.15 |
| Moment                             | 2.24.0  |
| Multer                             | 1.4.2   |
| Node-Fetch                         | 2.6.0   |
| Node-Mailer                        | 0.1.1   |
| PG                                 | 7.17.1  |
| PM2                                | 4.2.3   |
| PostgreSQL                         | 10.10   |
| React                              | 16.12.0 |
| React-DOM                          | 16.12.0 |
| React-Router-DOM                   | 5.1.2   |
| Session-File-Store                 | 1.3.1   |
| Socket.io                          | 2.3.0   |
| Webpack                            | 4.41.5  |
| Webpack-CLI                        | 3.3.10  |
| YouTube-API-Search                 | 0.0.5   |
## Live Demo
Try the application live [on my portfolio website](https://metalink.keith-tachibana.com/)
## Features
- Users can register for an account by setting up a password which gets hashed and saved in the database
- Users can authenticate themselves at the login page using said password
- Users can reset their password and be sent an e-mail containing a password reset link that expires in 1 hour using a token
- Users can post comments, album reviews, or other information for others to see when they log into the application, sorted by date from most recent to oldest
- Users can add a profile to their account, including a profile picture, screen name, e-mail address, real name, location, phone number, and favorite sub-genres of metal
- Users can view their individual post history (if any) and edit or delete them
- Users can search for concerts via the TicketMaster API and see the results in tabular format
- Users can also view the concert search results on Google Maps as clickable, animated markers with the corresponding concert information
- Users can join a global chat session with other currently logged-in users and message each other in real-time
- Users can log out and rejoin the chat room and still see all previous chat messages
- Users can search for band profiles using the Discogs API
- Users can search for YouTube videos and play them inside the application
## Preview
![Metalink Preview](preview.gif "Metalink Preview")
## Development
- [DB Designer available here](https://app.dbdesigner.net/designer/schema/312595)
- [Figma available here](https://www.figma.com/file/pzkKz7ZmE00RLNJQBJOxA7/MetaLink?node-id=0%3A1)
- [MeisterTask available here](https://www.meistertask.com/app/project/i8BR5WmN/metalink)
#### System Requirements
|  Requirement  |     Version    |
|---------------|---------------:|
| Nginx         | 1.10 or higher |
| Node          | 10 or higher   |
| NPM           | 6 or higher    |
| PM2           | 4 or higher    |
| PostgreSQL    | 10 or higher   |
| Ubuntu Server | 18.04 LTS      |
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
   - In the "server" code block, add this underneath the first location definition:
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
   - Save your changes (`Ctrl + O`) and exit (`Ctrl + X`)
   - Link your default site to the sites-enabled directory (if not already done):
  ```shell
  sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
  ```
8. Start nginx
  ```shell
  sudo service nginx start
  ```
9. Transpile React components using Webpack
  ```shell
  npm run build
  ```
10. Start the Express.js server using the pm2 module
  ```shell
  sudo pm2 --name "Metalink" start "npm run dev"
  ```
11. Open your default web browser and navigate to http://localhost:3000/ to see the result!
