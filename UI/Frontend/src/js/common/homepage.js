Home = {
  init: function() {
    var behaviourSlider = document.getElementById('behaviour');

    var range_all_sliders = {
    	'min': [50],
      '10%': [75],
      '20%': [100],
      '30%': [125],
      '40%': [150],
      '50%': [175],
      '60%': [200],
      '70%': [225],
      '80%': [250],
      '90%': [275],
    	'max': [300]
    };

    noUiSlider.create(behaviourSlider, {
    	start: [100, 150],
      step: 10,
      snap: true,
      connect: true,
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
    	connect: true
    });

  }
}

module.exports = Home;
