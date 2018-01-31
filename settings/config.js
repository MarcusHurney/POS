var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];
  // loop over config.json's keys (envConfig)
  // and set them to our current evironment
  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}
