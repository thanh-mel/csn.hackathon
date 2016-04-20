app         = require('./common/app');
powerWeight = require('./common/power-weight');
power       = require('./common/power');

app.ready = function() {
  app.PowerWeightRatio = powerWeight;
  app.PowerWeightRatio.init();

  app.Power = power;
  app.Power.init();
};

document.addEventListener('DOMContentLoaded', function() {
  return app.ready();
});
