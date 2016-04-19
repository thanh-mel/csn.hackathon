app   = require('./common/app');
home  = require('./common/homepage');

app.ready = function() {
  app.Home = home;
};

document.addEventListener('DOMContentLoaded', function() {
  return app.ready();
});
