module.exports = function() {
  switch(process.env.NODE_ENV) {
    case 'travis':
      return {
        mysql: {
          host     : '127.0.0.1',
          user     : 'root',
          database : 'ulc',
        }
      };

    default: // for local development
      return {
        mysql: {
          host     : 'localhost',
          user     : 'root',
          password : 'root',
          database : 'ulc',
        }
      };
  }
}