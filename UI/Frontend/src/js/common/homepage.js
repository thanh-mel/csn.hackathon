Home = {
  init: function() {
    var powerSlider = document.getElementById('behaviour');

    var range_all_sliders = {
    	'min': [50],
      // '10%': [75],
      // '20%': [100],
      // '30%': [125],
      // '40%': [150],
      // '50%': [175],
      // '60%': [200],
      // '70%': [225],
      // '80%': [250],
      // '90%': [275],
    	'max': [300]
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
      		values: [0, 20, 40, 60, 80, 100],
      		density: 4,
          format: wNumb({
        		decimals: 0,
        		postfix: ' kW'
        	})
    	},
    	behaviour: 'drag-tap',
      format: wNumb({ decimals: 0 })
    });

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

      console.log("slider values: " + values);
    });

  }
}

module.exports = Home;
