app         = require('./common/app');
powerWeight = require('./common/power-weight');
power       = require('./common/power');

app.ready = function() {
  app.PowerWeightRatio = powerWeight;
  app.PowerWeightRatio.init();

  app.Power = power;
  app.Power.init();

  $('.btn-close').click(function() {
    $('.page-wrapper').removeClass('showing-popup');
  });

  $('.anchor-power').click(function() {
    $('.page-wrapper').toggleClass('showing-popup');
    $('#tab-container').easytabs('select', '#power');
  });

  $('.anchor-power-weight').click(function() {
    $('.page-wrapper').toggleClass('showing-popup');
    $('#tab-container').easytabs('select', '#power-weight');
  });

  $('.power-weight-slider .btn-submit').click(function() {
    if(app.PowerWeightRatio.submitUrl) {
      window.location = 'http://www.carsales.com.au/cars/results?q=' + encodeURIComponent(app.PowerWeightRatio.submitUrl);
    } else {
      window.location = 'http://www.carsales.com.au/cars/results';
    }
  })

  $('.power-slider .btn-submit').click(function() {
    var values = app.Power.powerSlider.noUiSlider.get();
    var url = "((Service=[Carsales])&Power=range[" + values[0] + ".." + values[1] + "])";
    window.location = 'http://www.carsales.com.au/cars/results?q=' + encodeURIComponent(url);
  })

  $('#tab-container').easytabs();
};

document.addEventListener('DOMContentLoaded', function() {
  return app.ready();
});
