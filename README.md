# Metalink
A mobile-first, full-stack, web application for lovers of metal music that aims to link them with other fans of the genre
## Technologies Used
To be announced later
## Live Demo
To be announced later
## Features
- [DB Designer available here](https://app.dbdesigner.net/designer/schema/312595)
- [Figma available here](https://www.figma.com/file/pzkKz7ZmE00RLNJQBJOxA7/MetaLink?node-id=0%3A1)
- [MeisterTask available here](https://www.meistertask.com/app/project/i8BR5WmN/metalink)
- -Users can post comments, album reviews, or other information for others to see when they log into the application, sorted by date from
most recent to oldest
- -Users can add a profile to their account, including a profile picture, screen name, e-mail address, real name, location, phone number, location, and favorite sub-genres of metal
- -Users can view their post history (if any) and make changes to them if desired
- -Users can search for concerts in their area via the TicketMaster API and see the results in tabular format
- -Users can message other users to setup a chat session
- -Users can search for band and/or album information using an API such as Discogs or MusixMatch
## Preview
To be announced later
## Development
#### System Requirements
- -Node 10 or higher
- -NPM 6 or higher
- -PostgreSQL 10 or higher
#### Getting Started
1. Clone the repository
  ```shell
  git clone https://github.com/Keith-Tachibana/Metalink.git
  ```
2. Change directory to cloned folder
  ```shell
  cd Metalink/
  ```
3. Start PostgreSQL server
  ```shell
  sudo service postgresql start
  ```
4. Create database
  ```shell
  createdb metalink
  ```
5. Import schema
  ```shell
  psql -d metalink -f schema.sql
  ```
