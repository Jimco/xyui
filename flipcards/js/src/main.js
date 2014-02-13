define(function(require, exports, module){
  var Game = require('./flip');


  new Game();
  window.Game = Game;
});