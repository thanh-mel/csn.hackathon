Home = {
  init: function() {
    $('.anchor').click(function() {
      $('.page-wrapper').toggleClass('showing-popup');
    })

    var powerSlider = document.getElementById('slider');

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

    noUiSlider.create(powerSlider, {
    	start: [100, 150],
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
    	connectBase = powerSlider.querySelector('.noUi-base');

    // Give the bar a class for styling and add it to the slider.
    connectBar.className += 'connect';
    connectBase.appendChild(connectBar);

    powerSlider.noUiSlider.on('update', function( values, handle, a, b, handlePositions ) {
    	var offset = handlePositions[handle];

    	// Right offset is 100% - left offset
    	if ( handle === 1 ) {
    		offset = 100 - offset;
    	}
    	// Pick left for the first handle, right for the second.
    	connectBar.style[handle ? 'right' : 'left'] = offset + '%';

      $('.min-value').html(values[0]);
      $('.max-value').html(values[1]);

      console.log("slider values: " + values);
    });

  }
}

module.exports = Home;
