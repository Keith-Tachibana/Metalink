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
| Nodemailer                         | 0.1.1   |
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
- -Users can post comments, album reviews, or other information for others to see when they log into the application, sorted by date from most recent to oldest
- -Users can add a profile to their account, including a profile picture, screen name, e-mail address, real name, location, phone number, location, and favorite sub-genres of metal
- -Users can view their post history (if any) and make changes to them if desired
- -Users can search for concerts in their area via the TicketMaster API and see the results in tabular format
- -Users can message other users to setup a chat session
- -Users can search for band and/or album information using the Discogs API
## Preview
![Metalink Preview](preview.gif "Metalink Preview")
## Development
- -[DB Designer available here](https://app.dbdesigner.net/designer/schema/312595)
- -[Figma available here](https://www.figma.com/file/pzkKz7ZmE00RLNJQBJOxA7/MetaLink?node-id=0%3A1)
- -[MeisterTask available here](https://www.meistertask.com/app/project/i8BR5WmN/metalink)
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
6. Import schema
  ```shell
  psql -d metalink -f schema.sql
  ```
7. Use the psql REPL (Read Eval Print Loop) to import example data
  ```shell
  psql db=metalink
  \copy products from '/home/dev/lfz/Metalink/posts-data.csv' delimiter ',' csv header;
  ```
  - ...where `/home/dev/lfz/Metalink` is the absolute path to your cloned folder from step 2
8. Edit your nginx default site configuration to reverse proxy the Express.js server
  ```shell
  cd /etc/nginx/sites-available
  sudo nano default
  ```
   - -In the "server" code block, add this underneath the first location definition:
  ```shell
  location /api {
    proxy_pass http://127.0.0.1:3001;
  }
  ```
   - -Save your changes (`Ctrl + O`) and exit (`Ctrl + X`)
   - -Link your default site to the sites-enabled directory (if not already done):
  ```shell
  sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
  ```
9. Start nginx
  ```shell
  sudo service nginx start
  ```
10. Transpile React components using Webpack
  ```shell
  npm run build
  ```
11. Start the Express.js server using the pm2 module
  ```shell
  sudo pm2 --name "Metalink" start "npm run dev"
  ```
12. Open your default web browser and navigate to http://localhost:3000/ to see the result!
