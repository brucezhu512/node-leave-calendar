# Leave Calendar System  
[![Build Status](https://travis-ci.org/brucezhu512/node-leave-calendar.svg?branch=master)](https://travis-ci.org/brucezhu512/node-leave-calendar) [![Coverage Status](https://coveralls.io/repos/github/brucezhu512/node-leave-calendar/badge.svg?branch=master)](https://coveralls.io/github/brucezhu512/node-leave-calendar?branch=master)

An experimental project of personal leave calendar system built on Node.js.

## Prerequisites
- Node.js v8.9.x or greater (LTS)
- MySQL Community Server (GPL) v5.7.20
- Redis v4.0.x (deprecated)


## Get Started
1. Initialize database (assume MySQL installed and root password is 'root' as well)
```
$ mysql -e 'CREATE DATABASE IF NOT EXISTS ulc;'
  (Password entered here ... and no output after success)

$ mysql -u root -p ulc < database/data/mysql.sql
  (Password entered here ... and no output after success)

$ DEBUG=domain:* node ./database/import.js

  domain:user Import user [u353910] successfully. +0ms
  domain:user Import user [u389564] successfully. +3ms
  ...
  domain:leave Import 3 leave row(s) of u353910 successfully. +54ms
  domain:leave Import 4 leave row(s) of u389564 successfully. +0ms
  ...
  domain:catchup Import 2 leave row(s) of u353910 successfully. +38ms
  domain:catchup Import 2 leave row(s) of u389564 successfully. +0ms
  ...
  domain:pod Import pod "Moonraker" successfully. +7ms
  domain:pod Import pod "Fallout" successfully. +2ms
```
2. Copy css & scripts
```
$ npm run copy

> node-leave-calendar@0.0.1 copy /Workspace/github/node-leave-calendar
> sh ./copy-scripts.sh

./node_modules/bootstrap/dist/js/bootstrap.min.js -> ./public/scripts/bootstrap.min.js
./node_modules/bootstrap/dist/js/bootstrap.min.js.map -> ./public/scripts/bootstrap.min.js.map
./node_modules/jquery/dist/jquery.min.js -> ./public/scripts/jquery.min.js
./node_modules/jquery/dist/jquery.min.map -> ./public/scripts/jquery.min.map
./node_modules/popper.js/dist/popper.min.js -> ./public/scripts/popper.min.js
./node_modules/popper.js/dist/popper.min.js.map -> ./public/scripts/popper.min.js.map
./node_modules/feather-icons/dist/feather.min.js -> ./public/scripts/feather.min.js
./node_modules/feather-icons/dist/feather.min.js.map -> ./public/scripts/feather.min.js.map
./node_modules/chart.js/dist/Chart.min.js -> ./public/scripts/Chart.min.js
./node_modules/bootstrap/dist/css/bootstrap.min.css -> ./public/stylesheets/bootstrap.min.css
./node_modules/bootstrap/dist/css/bootstrap.min.css.map -> ./public/stylesheets/bootstrap.min.css.map
```
3. Start App Server
```
$ npm start

> node-leave-calendar@0.0.1 start /Workspace/github/node-leave-calendar
> node ./bin/www
```
4. Signin in browser using url below
```
http://localhost:3000
```