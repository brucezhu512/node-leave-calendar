# Leave Calendar System  
[![Build Status](https://travis-ci.org/brucezhu512/node-leave-calendar.svg?branch=master)](https://travis-ci.org/brucezhu512/node-leave-calendar) [![Coverage Status](https://coveralls.io/repos/github/brucezhu512/node-leave-calendar/badge.svg?branch=master)](https://coveralls.io/github/brucezhu512/node-leave-calendar?branch=master)

An experimental project of personal leave calendar system built on Node.js.

## Prerequisites
- Node.js v8.9.x (LTS)
- Redis v4.0.x

## Get Started
1. Initialize database
```
$ node ./database/import.js
Import user u353910 successfully.
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