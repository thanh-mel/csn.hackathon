global.app = new Object();

app.$$ = function(el) {
  return document.querySelectorAll(el);
};

app.$ = function(el) {
  return k$.$$(el)[0];
};

app.extend = function(destination, source) {
  var property;
  for (property in source) {
    if (source[property] && source[property].constructor && source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

app.debounceQueue = new Object;

module.exports = app;
