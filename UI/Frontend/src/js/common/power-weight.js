PowerWeightRatio = {
  init: function() {
    this.powerWeightSlider = document.getElementById('power-weight-slider');

    var range_all_sliders = {
    	'min': [50, 5],
      '10%': [75, 5],
      '20%': [100, 5],
      '30%': [125, 5],
      '40%': [150, 5],
      '50%': [175, 5],
      '60%': [200, 5],
      '70%': [225, 5],
      '80%': [250, 5],
      '90%': [300, 10],
      '95%': [350, 50],
    	'max': [600]
    };

    noUiSlider.create(this.powerWeightSlider, {
    	start: [80, 150],
      step: 10,
      connect: true,
      animate: true,
      tooltips: [
        wNumb({ decimals: 0 }),
        wNumb({ decimals: 0 })
      ],
      range: range_all_sliders,
      pips: {
      		mode: 'positions',
      		values: [0, 20, 32, 40, 60, 80, 90, 100],
      		density: 4,
          format: wNumb({
        		decimals: 0,
        		postfix: ' Wkg'
        	})
    	},
    	behaviour: 'drag-tap',
      format: wNumb({ decimals: 0 })
    });

    var restrictionEl = $('.power-weight-slider .noUi-value:contains("130 Wkg")')
    restrictionEl.addClass('restriction');
    restrictionEl.prev().addClass('restriction-marker');

    var connectBar = document.createElement('div'),
    	connectBase = this.powerWeightSlider.querySelector('.noUi-base');

    // Give the bar a class for styling and add it to the slider.
    connectBar.className += 'connect';
    connectBase.appendChild(connectBar);

    var _this = this;
    this.fetch();

    this.powerWeightSlider.noUiSlider.on('update', function( values, handle, a, b, handlePositions ) {
    	var offset = handlePositions[handle];

    	// Right offset is 100% - left offset
    	if ( handle === 1 ) {
    		offset = 100 - offset;
    	}
    	// Pick left for the first handle, right for the second.
    	connectBar.style[handle ? 'right' : 'left'] = offset + '%';

      // console.log("slider values: " + values);
      var minVal = values[0];
      var maxVal = values[1];
      $('.power-weight-slider .min-value').html(minVal);
      $('.power-weight-slider .max-value').html(maxVal);
    });


    this.powerWeightSlider.noUiSlider.on('change', function( values, handle, a, b, positions) {
      var minVal = values[0];
      var maxVal = values[1];

      // Force a margin between min and max
      if(maxVal - minVal < 20) {
        if($(_this.powerWeightSlider).data('min') !== undefined) {
            minVal = $(_this.powerWeightSlider).data('min');
        }
        if($(_this.powerWeightSlider).data('max') !== undefined) {
            maxVal = $(_this.powerWeightSlider).data('max');
        }
        _this.powerWeightSlider.noUiSlider.set([minVal, maxVal]);
      } else {
        _this.fetch();
      }

      $('.power-weight-slider .min-value').html(minVal);
      $('.power-weight-slider .max-value').html(maxVal);

      $(_this.powerWeightSlider).data('min', minVal);
      $(_this.powerWeightSlider).data('max', maxVal);
    })
  },

  fetch: function() {
    // console.log(this);

    var values = this.powerWeightSlider.noUiSlider.get();
    var minVal = values[0];
    var maxVal = values[1];
    var _this = this;

    $('.power-weight-slider .column-min ul, .power-weight-slider .column-max ul').addClass('is-loading');
    $('.power-weight-slider .column-min ul, .power-weight-slider .column-max ul').empty();
    $('.power-weight-slider li a').tipso('destroy');

    promise.get('http://inchcape.stocklocator.csdt279.dev.au/api/cars/range/power-weight-ratio?min=' + minVal + '&max=' + maxVal + '&year=2011')
        .then(function(error, text, xhr) {
          if (error) {
            _this.results = null;
            _this.resetResults();
          } else {
            _this.results = JSON.parse(xhr.response);
            _this.populateResults();
          }
        });

    promise.get('http://inchcape.stocklocator.csdt279.dev.au/api/specs/power/range?minpowerweightratio=' + minVal + '&maxpowerweightratio=' + maxVal + '&year=2011')
        .then(function(error, text, xhr) {
          if (error) {
            _this.submitUrl = null;
          } else {
            _this.submitUrl = JSON.parse(xhr.response).Url;
          }
        });
  },

  populateResults: function() {
    console.log('parseResults for power-weight');
    var results = this.results;
    var top3FromMin = _.sampleSize(_.uniqBy(_.shuffle(results.MinRange), 'Make'), 3);
    var top3FromMax = _.sampleSize(_.uniqBy(_.shuffle(results.MaxRange), 'Make'), 3);

    $('.power-weight-slider .column-min ul, .power-weight-slider .column-max ul').empty();
    $('.power-weight-slider .column-min ul, .power-weight-slider .column-max ul').removeClass('is-loading');
    $('.power-weight-slider li a').tipso('destroy');

    _.map(top3FromMin, function(item) {
      item.encodedUrl = 'http://www.carsales.com.au/cars/results?q=' + encodeURIComponent(item.Url);
      item.Image = '<img src=http://carsales.li.csnstatic.com' + item.ImageUrl + ' alt= />';

      $('.power-weight-slider .column-min ul').append('<li><a data-tipso="' + item.Image + '" data-tipso-title="'+ item.Make + ' ' + item.Model +'" href="' + item.encodedUrl + '" target="_blank">' + item.Make + ' ' + item.Model + ' </a></li>');
    })
    _.map(top3FromMax, function(item) {
      item.encodedUrl = 'http://www.carsales.com.au/cars/results?q=' + encodeURIComponent(item.Url);
      item.Image = '<img src=http://carsales.li.csnstatic.com' + item.ImageUrl + ' alt= />';

      $('.power-weight-slider .column-max ul').append('<li><a data-tipso="' + item.Image + '" data-tipso-title="'+ item.Make + ' ' + item.Model +'" href="' + item.encodedUrl + '" target="_blank">' + item.Make + ' ' + item.Model + ' </a></li>');
    })
    $('.power-weight-slider li a').tipso({
      useTitle: false,
      tooltipHover: true,
      titleBackground: '#004F88',
      background: '#',
      size: 'large',
      position: 'right',
      showArrow: false
    });
  },

  resetResults: function() {
    $('.power-weight-slider .column-min ul, .power-weight-slider .column-max ul').empty();
    $('.power-weight-slider .column-min ul, .power-weight-slider .column-max ul').removeClass('is-loading');
    $('.power-weight-slider li a').tipso('destroy');
  }
}

module.exports = PowerWeightRatio;
