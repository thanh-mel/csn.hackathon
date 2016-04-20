Home = {
  init: function() {
    $('.anchor').click(function() {
      $('.page-wrapper').toggleClass('showing-popup');
    })

    this.powerSlider = document.getElementById('slider');

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

    noUiSlider.create(this.powerSlider, {
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

    var restrictionEl = $('.noUi-value:contains("130 Wkg")')
    restrictionEl.addClass('restriction');
    restrictionEl.prev().addClass('restriction-marker');

    var connectBar = document.createElement('div'),
    	connectBase = this.powerSlider.querySelector('.noUi-base');

    // Give the bar a class for styling and add it to the slider.
    connectBar.className += 'connect';
    connectBase.appendChild(connectBar);

    var _this = this;

    this.powerSlider.noUiSlider.on('update', function( values, handle, a, b, handlePositions ) {
    	var offset = handlePositions[handle];

    	// Right offset is 100% - left offset
    	if ( handle === 1 ) {
    		offset = 100 - offset;
    	}
    	// Pick left for the first handle, right for the second.
    	connectBar.style[handle ? 'right' : 'left'] = offset + '%';

      // console.log("slider values: " + values);
    });


    this.powerSlider.noUiSlider.on('change', function( values, handle, a, b, positions) {
      var minVal = values[0];
      var maxVal = values[1];

      // Force a margin between min and max
      if(maxVal - minVal < 20) {
        if($(powerSlider).data('min') !== undefined) {
            minVal = $(powerSlider).data('min');
        }
        if($(powerSlider).data('max') !== undefined) {
            maxVal = $(powerSlider).data('max');
        }
        slider.noUiSlider.set([minVal, maxVal]);
      }
      $('.min-value').html(minVal);
      $('.max-value').html(maxVal);

      $(this.powerSlider).data('min', minVal);
      $(this.powerSlider).data('max', maxVal);

      _this.fetch();
    })
  },

  fetch: function() {
    console.log(this);

    var values = this.powerSlider.noUiSlider.get();
    var minVal = values[0];
    var maxVal = values[1];
    var _this = this;

    $('.column-min ul, .column-max ul').addClass('is-loading');
    $('.column-min ul, .column-max ul').empty();

    promise.get('http://inchcape.stocklocator.csdt279.dev.au/api/cars/specs/power-to-weight-ratio?min=' + minVal + '&max=' + maxVal + '&year=2009')
        .then(function(error, text, xhr) {
          if (error) {
            _this.results = null;
            _this.resetResults();
          } else {
            _this.results = JSON.parse(xhr.response);
            _this.populateResults();
          }
        })
  },

  populateResults: function() {
    console.log('parseResults');
    var results = this.results;
    var top3FromMin = _.sampleSize(results.MinRange, 3);
    var top3FromMax = _.sampleSize(results.MaxRange, 3);

    $('.column-min ul, .column-max ul').removeClass('is-loading');

    _.map(top3FromMin, function(item) {
      $('.column-min ul').append('<li>' + item.Make + ' ' + item.Model + '</li>');
    })
    _.map(top3FromMax, function(item) {
      $('.column-max ul').append('<li>' + item.Make + ' ' + item.Model + '</li>');
    })
  },

  resetResults: function() {
    $('.column-min ul, .column-max ul').removeClass('is-loading');
  }
}

module.exports = Home;
